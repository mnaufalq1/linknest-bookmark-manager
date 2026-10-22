import test from "node:test";
import assert from "node:assert/strict";
import {
  validateUrl,
  validateCreateBookmarkInput,
  validateUpdateBookmarkInput,
  validateBookmarkId,
  MAX_TITLE_LENGTH,
  MAX_URL_LENGTH,
  MAX_CATEGORY_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_ICON_LENGTH,
} from "../src/lib/validators.ts";

test("Konstanta validator memiliki batasan yang benar", () => {
  assert.equal(MAX_TITLE_LENGTH, 200);
  assert.equal(MAX_URL_LENGTH, 2048);
  assert.equal(MAX_CATEGORY_LENGTH, 50);
  assert.equal(MAX_DESCRIPTION_LENGTH, 1000);
  assert.equal(MAX_ICON_LENGTH, 10);
});

test("validateUrl: menerima URL HTTP dan HTTPS yang valid", () => {
  const httpResult = validateUrl("http://example.com");
  assert.equal(httpResult.isValid, true);
  if (httpResult.isValid) {
    assert.equal(httpResult.data.hostname, "example.com");
  }

  const httpsResult = validateUrl("https://github.com/path?query=1#hash");
  assert.equal(httpsResult.isValid, true);
  if (httpsResult.isValid) {
    assert.equal(httpsResult.data.protocol, "https:");
  }
});

test("validateUrl: menolak string bukan URL atau kosong", () => {
  assert.equal(validateUrl("").isValid, false);
  assert.equal(validateUrl("   ").isValid, false);
  assert.equal(validateUrl("bukan-sebuah-url").isValid, false);
});

test("validateUrl: menolak protokol selain HTTP dan HTTPS", () => {
  const ftpResult = validateUrl("ftp://files.example.com");
  assert.equal(ftpResult.isValid, false);
  if (!ftpResult.isValid) {
    assert.match(ftpResult.error, /HTTP atau HTTPS/);
  }

  const jsResult = validateUrl("javascript:alert(1)");
  assert.equal(jsResult.isValid, false);

  const fileResult = validateUrl("file:///C:/secret.txt");
  assert.equal(fileResult.isValid, false);
});

test("validateUrl: menolak URL yang melebihi MAX_URL_LENGTH", () => {
  const overlyLong = "https://example.com/" + "a".repeat(MAX_URL_LENGTH);
  const result = validateUrl(overlyLong);
  assert.equal(result.isValid, false);
  if (!result.isValid) {
    assert.match(result.error, /melebihi/);
  }
});

test("validateCreateBookmarkInput: berhasil dengan payload yang benar", () => {
  const result = validateCreateBookmarkInput({
    title: "  Next.js Documentation  ",
    url: "https://nextjs.org",
    category: "Development",
    description: "Panduan resmi Next.js",
    icon: "⚡",
  });

  assert.equal(result.isValid, true);
  if (result.isValid) {
    assert.equal(result.data.title, "Next.js Documentation");
    assert.equal(result.data.url, "https://nextjs.org/");
    assert.equal(result.data.category, "Development");
    assert.equal(result.data.description, "Panduan resmi Next.js");
    assert.equal(result.data.icon, "⚡");
  }
});

test("validateCreateBookmarkInput: menolak field wajib yang kosong", () => {
  const resMissingTitle = validateCreateBookmarkInput({
    title: "",
    url: "https://example.com",
    category: "Dev",
  });
  assert.equal(resMissingTitle.isValid, false);

  const resMissingUrl = validateCreateBookmarkInput({
    title: "Test",
    url: "",
    category: "Dev",
  });
  assert.equal(resMissingUrl.isValid, false);

  const resMissingCategory = validateCreateBookmarkInput({
    title: "Test",
    url: "https://example.com",
    category: "",
  });
  assert.equal(resMissingCategory.isValid, false);
});

test("validateCreateBookmarkInput: menolak input melebihi batas panjang karakter", () => {
  const resLongTitle = validateCreateBookmarkInput({
    title: "A".repeat(MAX_TITLE_LENGTH + 1),
    url: "https://example.com",
    category: "Dev",
  });
  assert.equal(resLongTitle.isValid, false);

  const resLongCat = validateCreateBookmarkInput({
    title: "Valid Title",
    url: "https://example.com",
    category: "C".repeat(MAX_CATEGORY_LENGTH + 1),
  });
  assert.equal(resLongCat.isValid, false);

  const resLongDesc = validateCreateBookmarkInput({
    title: "Valid Title",
    url: "https://example.com",
    category: "Dev",
    description: "D".repeat(MAX_DESCRIPTION_LENGTH + 1),
  });
  assert.equal(resLongDesc.isValid, false);
});

test("validateCreateBookmarkInput: memberikan nilai default icon dan description jika tidak diisi", () => {
  const result = validateCreateBookmarkInput({
    title: "Clean App",
    url: "https://example.com",
    category: "Dev",
  });

  assert.equal(result.isValid, true);
  if (result.isValid) {
    assert.equal(result.data.icon, "🔗");
    assert.equal(result.data.description, "Belum ada deskripsi.");
  }
});

test("validateUpdateBookmarkInput: menerima pembaruan parsial yang valid", () => {
  const result = validateUpdateBookmarkInput({
    title: "Updated Title",
    favorite: true,
  });

  assert.equal(result.isValid, true);
  if (result.isValid) {
    assert.equal(result.data.title, "Updated Title");
    assert.equal(result.data.favorite, true);
    assert.equal(result.data.category, undefined);
  }
});

test("validateUpdateBookmarkInput: menolak update kosong atau tanpa perubahan valid", () => {
  const resEmpty = validateUpdateBookmarkInput({});
  assert.equal(resEmpty.isValid, false);

  const resUnknownOnly = validateUpdateBookmarkInput({ foo: "bar" });
  assert.equal(resUnknownOnly.isValid, false);
});

test("validateUpdateBookmarkInput: menolak string judul atau kategori kosong", () => {
  const resBlankTitle = validateUpdateBookmarkInput({ title: "   " });
  assert.equal(resBlankTitle.isValid, false);

  const resBlankCat = validateUpdateBookmarkInput({ category: "   " });
  assert.equal(resBlankCat.isValid, false);
});

test("validateBookmarkId: memvalidasi integer positif dengan benar", () => {
  assert.equal(validateBookmarkId(1).isValid, true);
  const res42 = validateBookmarkId("42");
  assert.equal(res42.isValid, true);
  if (res42.isValid) {
    assert.equal(res42.data, 42);
  }

  assert.equal(validateBookmarkId(0).isValid, false);
  assert.equal(validateBookmarkId(-5).isValid, false);
  assert.equal(validateBookmarkId(3.14).isValid, false);
  assert.equal(validateBookmarkId("bukan-angka").isValid, false);
  assert.equal(validateBookmarkId(null).isValid, false);
});
