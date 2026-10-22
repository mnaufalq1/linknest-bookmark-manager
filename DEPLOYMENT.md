# Panduan Deployment LinkNest (Production Ready)

Dokumen ini menjelaskan langkah-langkah lengkap untuk mendeploy **LinkNest** ke lingkungan produksi (Vercel, Supabase/Neon/Railway PostgreSQL, dan konfigurasi OAuth).

---

## 1. Persiapan Database Produksi (PostgreSQL)

Pilih salah satu penyedia PostgreSQL cloud yang stabil dengan connection pooling:

### Opsi A: Supabase (Disarankan)
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **Project Settings** > **Database** > **Connection Pooling**.
3. Gunakan mode **Session** atau **Transaction** (port `6543` atau `5432`).
4. Salin string koneksi URI:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

### Opsi B: Neon Tech
1. Buat project di [neon.tech](https://neon.tech).
2. Pilih database branch `main` dan centang **Pooled connection**.
3. Salin connection string yang memiliki endpoint `-pooler`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].neon.tech/neondb?sslmode=require"
   ```

### Opsi C: Railway / Render
1. Tambahkan service PostgreSQL.
2. Salin variabel `DATABASE_URL` publik/privat yang disediakan.

---

## 2. Menjalankan Database Migrations ke Produksi

> [!IMPORTANT]
> Jangan pernah menjalankan `prisma migrate dev` di database produksi! Gunakan `prisma migrate deploy` agar migrasi diterapkan secara aman dan non-destruktif.

Dari terminal lokal atau CI/CD pipeline, jalankan:

```bash
# Set DATABASE_URL ke database produksi sementara di terminal:
export DATABASE_URL="postgresql://..." # Linux / macOS
# atau pada Windows PowerShell:
# $env:DATABASE_URL="postgresql://..."

# Jalankan migrasi produksi:
pnpm migrate:deploy
```

Script ini otomatis menjalankan semua file migrasi yang berada di `apps/web/prisma/migrations` tanpa mereset data pengguna.

---

## 3. Environment Variables Produksi

Tambahkan variabel-variabel berikut di dashboard platform hosting (misal: Vercel Project Settings > Environment Variables):

| Nama Variabel | Wajib/Opsional | Deskripsi & Format |
|---|---|---|
| `DATABASE_URL` | **Wajib** | Connection string PostgreSQL produksi (dengan connection pooling). |
| `BETTER_AUTH_SECRET` | **Wajib** | Token acak minimal 32 karakter untuk enkripsi sesi. |
| `BETTER_AUTH_URL` | **Wajib** | Domain publik aplikasi (contoh: `https://linknest.vercel.app`). |
| `GOOGLE_CLIENT_ID` | Opsional | Client ID OAuth Google Cloud. |
| `GOOGLE_CLIENT_SECRET` | Opsional | Client Secret OAuth Google Cloud. |
| `GITHUB_CLIENT_ID` | Opsional | Client ID GitHub Developer OAuth App. |
| `GITHUB_CLIENT_SECRET` | Opsional | Client Secret GitHub Developer OAuth App. |

### Cara Membuat `BETTER_AUTH_SECRET`:
Jalankan salah satu perintah berikut di terminal:
```bash
openssl rand -base64 32
# atau
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 4. Konfigurasi OAuth untuk Domain Produksi

Jika mengaktifkan Google atau GitHub Social Login, daftarkan URL callback domain produksi:

### Google Cloud Console:
1. Buka [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials**.
2. Pilih OAuth 2.0 Client ID Anda.
3. Di bagian **Authorized redirect URIs**, tambahkan:
   ```
   https://<domain-anda.com>/api/auth/callback/google
   ```
4. Di bagian **Authorized JavaScript origins**, tambahkan:
   ```
   https://<domain-anda.com>
   ```

### GitHub Developer Settings:
1. Buka [GitHub Developer Settings](https://github.com/settings/developers) > **OAuth Apps**.
2. Masukkan:
   - **Homepage URL:** `https://<domain-anda.com>`
   - **Authorization callback URL:** `https://<domain-anda.com>/api/auth/callback/github`

---

## 5. Deployment ke Vercel (Panduan Langkah demi Langkah)

Karena LinkNest menggunakan pnpm monorepo, ikuti konfigurasi berikut saat mengimpor repository di Vercel:

1. **Import Git Repository** di Vercel.
2. Di bagian **Project Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Pilih `apps/web` (centang *"Include files outside the root directory in the Build Step"* jika diminta).
3. Di bagian **Build & Development Settings**:
   - **Build Command:** `pnpm build` *(otomatis menjalankan `prisma generate && next build`)*
   - **Install Command:** `pnpm install`
4. Di bagian **Environment Variables**:
   - Masukkan seluruh nilai dari tabel Langkah 3.
5. Klik **Deploy**.

---

## 6. Verifikasi & Smoke Test Pasca Deployment

Setelah proses deployment selesai:

1. **Akses Landing Page:** Buka URL produksi (`https://<domain-anda>`). Pastikan tema Retro Neo-Brutalist dan font Google dimuat tanpa FOUC.
2. **Uji Registrasi Akun:** Daftarkan akun baru via email & password di `/register`.
3. **Uji Login & Dashboard Redirect:** Masuk di `/login` dan pastikan langsung diarahkan ke `/dashboard` tanpa perlu refresh manual.
4. **Uji CRUD Bookmark:**
   - Tambah bookmark baru (+ validasi form).
   - Edit bookmark yang baru dibuat.
   - Tandai favorit dan arsip.
   - Uji fitur pencarian dan filter kategori.
   - Hapus bookmark.
5. **Uji Isolasi Data:** Buka jendela Incognito / Browser lain, buat akun kedua, dan pastikan data bookmark akun pertama tidak terlihat oleh akun kedua.
6. **Uji Social Login:** Klik tombol Google atau GitHub jika kredensial sudah dikonfigurasi.

---

## 7. Prosedur Rollback & Troubleshooting

### Jika Terjadi Error Setelah Deploy:
1. **Periksa Vercel Runtime Logs:**
   - Buka dashboard Vercel > **Deployments** > Klik deployment aktif > **Functions / Runtime Logs**.
2. **Koneksi Database Timeout / Max Client Reached:**
   - Pastikan `DATABASE_URL` menggunakan connection pooler (misal: port `6543` di Supabase, atau `-pooler` di Neon).
3. **Rollback Instan:**
   - Di dashboard Vercel, buka menu **Deployments**.
   - Cari deployment stabil sebelumnya.
   - Klik menu titik tiga `...` dan pilih **Promote to Production**. Vercel akan mengalihkan trafik dalam hitungan detik tanpa perlu build ulang.
4. **Rollback Migrasi Skema (Jika Diperlukan):**
   - Buat file migrasi baru untuk membatalkan perubahan skema (`prisma migrate diff` atau migrasi penyesuaian).
   - Jangan melakukan reset database di produksi.
