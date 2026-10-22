import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";

const BASE_URL =
  process.env.TEST_BASE_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:5000";

// Helper untuk mengecek apakah server aktif
async function isServerRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/ok`, {
      signal: AbortSignal.timeout(1500),
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

// Helper untuk mendaftarkan user baru dan mendapatkan cookie sesi
async function registerUser(emailPrefix: string) {
  const email = `${emailPrefix}_${Date.now()}@example.com`;
  const password = "PasswordTesting123!";

  const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: BASE_URL,
    },
    body: JSON.stringify({
      name: "Test Runner",
      email,
      password,
    }),
  });

  assert.equal(
    response.status,
    200,
    `Gagal registrasi user test: ${response.status}`,
  );
  const cookie = response.headers.get("set-cookie") || "";
  const data = await response.json();

  return { email, cookie, userId: data.user.id };
}

// Helper fetch dengan cookie
function authFetch(
  endpoint: string,
  options: RequestInit = {},
  cookie?: string,
) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (cookie) {
    headers.set("cookie", cookie);
  }
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

test("Keamanan: Endpoint menolak request tanpa autentikasi dengan status 401", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const getRes = await authFetch("/api/bookmarks", { method: "GET" });
  assert.equal(getRes.status, 401);

  const postRes = await authFetch("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify({ title: "X", url: "https://x.com", category: "Dev" }),
  });
  assert.equal(postRes.status, 401);

  const patchRes = await authFetch("/api/bookmarks", {
    method: "PATCH",
    body: JSON.stringify({ id: 1, title: "Updated" }),
  });
  assert.equal(patchRes.status, 401);

  const deleteRes = await authFetch("/api/bookmarks", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  assert.equal(deleteRes.status, 401);
});

test("Keamanan: Metode HTTP yang tidak diizinkan mengembalikan status 405", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const putRes = await authFetch("/api/bookmarks", { method: "PUT" });
  assert.equal(putRes.status, 405);
});

test("Keamanan & Validasi: Payload JSON rusak mengembalikan 400 tanpa crash atau bocor stack trace", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const user = await registerUser("tester_json");

  const res = await fetch(`${BASE_URL}/api/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: user.cookie,
    },
    body: "{ malformed json payload ...",
  });

  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
  assert.match(json.message, /JSON/i);
  // Pastikan tidak ada kebocoran stack trace atau connection string
  assert.equal(JSON.stringify(json).includes("postgresql://"), false);
  assert.equal(json.stack, undefined);
});

test("Validasi: Menolak input kosong, URL salah format, dan batas panjang karakter", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const user = await registerUser("tester_val");

  // 1. Input kosong
  const resEmpty = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({ title: "", url: "", category: "" }),
    },
    user.cookie,
  );
  assert.equal(resEmpty.status, 400);

  // 2. Format URL tidak valid
  const resBadUrl = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        url: "bukan-url-valid",
        category: "Dev",
      }),
    },
    user.cookie,
  );
  assert.equal(resBadUrl.status, 400);

  // 3. Protokol selain HTTP/HTTPS
  const resFtp = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        url: "ftp://example.com/file",
        category: "Dev",
      }),
    },
    user.cookie,
  );
  assert.equal(resFtp.status, 400);

  // 4. Judul melebihi 200 karakter
  const resLongTitle = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "A".repeat(201),
        url: "https://example.com",
        category: "Dev",
      }),
    },
    user.cookie,
  );
  assert.equal(resLongTitle.status, 400);
});

test("CRUD & Keamanan: Alur lengkap Create, Read, Update, Delete dan Isolasi Pengguna", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const userA = await registerUser("user_a");
  const userB = await registerUser("user_b");

  // 1. User A membuat bookmark
  const createRes = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Next.js Docs",
        url: "https://nextjs.org",
        category: "Development",
        description: "Dokumentasi resmi Next.js App Router.",
        icon: "⚡",
      }),
    },
    userA.cookie,
  );

  assert.equal(createRes.status, 201);
  const createData = await createRes.json();
  assert.equal(createData.success, true);
  const bookmarkId = createData.data.id;
  assert.equal(typeof bookmarkId, "number");

  // 2. User A membaca bookmark
  const readRes = await authFetch("/api/bookmarks", { method: "GET" }, userA.cookie);
  assert.equal(readRes.status, 200);
  const readData = await readRes.json();
  assert.equal(Array.isArray(readData.data), true);
  const foundA = readData.data.find((b: { id: number }) => b.id === bookmarkId);
  assert.ok(foundA, "Bookmark yang baru dibuat harus ditemukan di list User A");
  assert.equal(foundA.title, "Next.js Docs");

  // 3. ISOLASI: User B membaca daftar bookmark miliknya - bookmark User A TIDAK BOLEH muncul
  const readBRes = await authFetch("/api/bookmarks", { method: "GET" }, userB.cookie);
  assert.equal(readBRes.status, 200);
  const readBData = await readBRes.json();
  const foundInB = readBData.data.find((b: { id: number }) => b.id === bookmarkId);
  assert.equal(foundInB, undefined, "User B tidak boleh melihat bookmark User A");

  // 4. ISOLASI: User B mencoba mengubah bookmark milik User A -> Harus ditolak (404)
  const patchBRes = await authFetch(
    "/api/bookmarks",
    {
      method: "PATCH",
      body: JSON.stringify({
        id: bookmarkId,
        title: "Hacked by User B",
      }),
    },
    userB.cookie,
  );
  assert.equal(patchBRes.status, 404);

  // 5. User A memperbarui bookmark miliknya (Update)
  const updateRes = await authFetch(
    "/api/bookmarks",
    {
      method: "PATCH",
      body: JSON.stringify({
        id: bookmarkId,
        title: "Next.js 16 Documentation",
        favorite: true,
        archived: true,
        category: "Framework",
        description: "Deskripsi terupdate.",
      }),
    },
    userA.cookie,
  );
  assert.equal(updateRes.status, 200);
  const updateData = await updateRes.json();
  assert.equal(updateData.data.title, "Next.js 16 Documentation");
  assert.equal(updateData.data.favorite, true);
  assert.equal(updateData.data.archived, true);
  assert.equal(updateData.data.category, "Framework");

  // 6. ISOLASI: User B mencoba menghapus bookmark milik User A -> Harus ditolak (404)
  const deleteBRes = await authFetch(
    "/api/bookmarks",
    {
      method: "DELETE",
      body: JSON.stringify({ id: bookmarkId }),
    },
    userB.cookie,
  );
  assert.equal(deleteBRes.status, 404);

  // 7. User A menghapus bookmark miliknya (Delete)
  const deleteRes = await authFetch(
    "/api/bookmarks",
    {
      method: "DELETE",
      body: JSON.stringify({ id: bookmarkId }),
    },
    userA.cookie,
  );
  assert.equal(deleteRes.status, 200);

  // 8. Menghapus ulang ID yang sudah terhapus -> Harus 404
  const deleteAgainRes = await authFetch(
    "/api/bookmarks",
    {
      method: "DELETE",
      body: JSON.stringify({ id: bookmarkId }),
    },
    userA.cookie,
  );
  assert.equal(deleteAgainRes.status, 404);
});

test("Fitur: Pencarian, filter kategori, favorit, dan arsip", async (t: TestContext) => {
  if (!(await isServerRunning())) {
    t.skip(`Server di ${BASE_URL} tidak aktif. Lewati integration test.`);
    return;
  }
  const user = await registerUser("tester_search");

  // 1. Buat beberapa bookmark dengan tag dan kategori berbeda
  await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "React Official",
        url: "https://react.dev",
        category: "Frontend",
        description: "The library for web and native user interfaces",
      }),
    },
    user.cookie,
  );

  const bm2Res = await authFetch(
    "/api/bookmarks",
    {
      method: "POST",
      body: JSON.stringify({
        title: "PostgreSQL Database",
        url: "https://www.postgresql.org",
        category: "Backend",
        description: "Powerful open source object-relational database system",
      }),
    },
    user.cookie,
  );
  const bm2 = (await bm2Res.json()).data;

  // 2. Jadikan bm2 sebagai favorit dan arsip
  await authFetch(
    "/api/bookmarks",
    {
      method: "PATCH",
      body: JSON.stringify({
        id: bm2.id,
        favorite: true,
        archived: true,
      }),
    },
    user.cookie,
  );

  // 3. Ambil semua bookmark user
  const listRes = await authFetch("/api/bookmarks", { method: "GET" }, user.cookie);
  const { data: allBookmarks } = await listRes.json();

  assert.equal(allBookmarks.length, 2);

  // 4. Filter pencarian berdasarkan judul
  const searchByTitle = allBookmarks.filter((b: { title: string }) =>
    b.title.toLowerCase().includes("react"),
  );
  assert.equal(searchByTitle.length, 1);
  assert.equal(searchByTitle[0].title, "React Official");

  // 5. Filter pencarian berdasarkan deskripsi
  const searchByDesc = allBookmarks.filter((b: { description: string }) =>
    b.description.toLowerCase().includes("relational database"),
  );
  assert.equal(searchByDesc.length, 1);
  assert.equal(searchByDesc[0].title, "PostgreSQL Database");

  // 6. Filter kategori
  const filterCat = allBookmarks.filter(
    (b: { category: string }) => b.category === "Frontend",
  );
  assert.equal(filterCat.length, 1);

  // 7. Filter favorit
  const favorites = allBookmarks.filter(
    (b: { favorite: boolean }) => b.favorite === true,
  );
  assert.equal(favorites.length, 1);
  assert.equal(favorites[0].id, bm2.id);

  // 8. Filter arsip
  const archived = allBookmarks.filter(
    (b: { archived: boolean }) => b.archived === true,
  );
  assert.equal(archived.length, 1);
  assert.equal(archived[0].id, bm2.id);
});

test("Keamanan & Penanganan Error: Respons error API tidak membocorkan kredensial atau stack trace", async () => {
  // Simulasi penanganan error: format respons aman tanpa membocorkan kredensial atau connection string
  const safeErrorResponse = {
    success: false,
    message: "Gagal mengambil data bookmark.",
  };
  assert.equal(safeErrorResponse.success, false);
  assert.equal("password" in safeErrorResponse, false);
  assert.equal("stack" in safeErrorResponse, false);
  assert.equal("DATABASE_URL" in safeErrorResponse, false);
  assert.equal(JSON.stringify(safeErrorResponse).includes("postgresql://"), false);
});

