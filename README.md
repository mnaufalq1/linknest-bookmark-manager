# 🌿 LinkNest

**Simpan, kelola, dan temukan kembali tautan favoritmu dalam satu tempat.**

LinkNest adalah aplikasi bookmark manager berbasis web untuk membantu pengguna mengorganisasi tautan website dengan lebih rapi. Dengan antarmuka bergaya **Retro Neo-Brutalism**, LinkNest menggabungkan tampilan retro yang hangat dengan pengalaman penggunaan yang modern.

## ✨ Fitur

- 🔖 **Manajemen Bookmark** — Tambahkan, lihat, edit, dan hapus bookmark.
- ⭐ **Favorit** — Tandai tautan yang sering digunakan.
- 📦 **Arsip** — Simpan bookmark yang tidak ingin ditampilkan di daftar utama.
- 🔍 **Pencarian** — Cari bookmark berdasarkan judul, URL, atau kategori.
- 🏷️ **Kategori** — Kelompokkan tautan agar lebih mudah ditemukan.
- 🌓 **Tema Terang dan Gelap** — Pilih tampilan sesuai preferensi.
- 🔐 **Autentikasi** — Registrasi dan login menggunakan Better Auth.
- 👤 **Bookmark per Pengguna** — Data bookmark dikaitkan dengan akun pengguna.
- 📱 **Antarmuka Responsif** — Dirancang untuk desktop dan perangkat mobile.
- 🎨 **Komponen UI Reusable** — Termasuk komponen dialog, input password, dan pesan formulir.

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|---|---|
| Next.js 16 | Framework aplikasi web |
| React 19 | Pembuatan antarmuka |
| TypeScript | Penulisan kode dengan tipe yang lebih aman |
| Tailwind CSS 4 | Styling dan layout |
| Prisma 7 | ORM untuk mengakses database |
| PostgreSQL | Penyimpanan data |
| Better Auth | Autentikasi pengguna |
| pnpm | Manajemen package dan monorepo |
| Lucide React | Ikon antarmuka |
| Sonner | Notifikasi aplikasi |

## 📁 Struktur Proyek

```text
my-bookmark-manager/
├── apps/
│   └── web/
│       ├── prisma/
│       │   ├── migrations/
│       │   ├── schema.prisma
│       │   ├── account.prisma
│       │   ├── bookmark.prisma
│       │   ├── session.prisma
│       │   ├── user.prisma
│       │   └── verification.prisma
│       └── src/
│           ├── app/
│           │   ├── api/
│           │   │   ├── auth/
│           │   │   └── bookmarks/
│           │   ├── dashboard/
│           │   ├── login/
│           │   ├── register/
│           │   └── page.tsx
│           ├── components/
│           │   ├── bookmarks/
│           │   └── ui/
│           ├── hooks/
│           └── lib/
├── packages/
│   └── shared/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🚀 Menjalankan Proyek

### 1. Persyaratan

Pastikan perangkatmu sudah memiliki:

- Node.js
- pnpm
- PostgreSQL

### 2. Clone repositori

Jika proyek sudah diunggah ke GitHub:

```bash
git clone <URL_REPOSITORI>
cd my-bookmark-manager
```

Ganti `<URL_REPOSITORI>` dengan URL repositori milikmu.

### 3. Instal dependensi

Jalankan dari direktori root proyek:

```bash
pnpm install
```

### 4. Konfigurasi environment

Buat file `.env` di direktori `apps/web/` dan isi variabel berikut:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/linknest"
BETTER_AUTH_SECRET="GANTI_DENGAN_SECRET_ACAK"
BETTER_AUTH_URL="http://localhost:3000"
```

Sesuaikan `USER`, `PASSWORD`, dan nama database dengan konfigurasi PostgreSQL milikmu.

Buat secret acak yang kuat untuk `BETTER_AUTH_SECRET`. Jangan gunakan contoh secret dari dokumentasi sebagai secret produksi.

> **Catatan:** Pastikan nama variabel environment dan lokasi file `.env` sesuai dengan konfigurasi proyekmu. Jangan mengunggah file `.env` ke repositori publik.

### 5. Siapkan database

Dari direktori `apps/web/`, jalankan migrasi Prisma:

```bash
pnpm exec prisma migrate dev
```

Jika perubahan schema sudah dibuat tetapi client Prisma belum diperbarui, jalankan:

```bash
pnpm exec prisma generate
```

Perintah Prisma harus dijalankan dari workspace yang memiliki dependensi Prisma dan konfigurasi `prisma.config.ts`.

### 6. Jalankan aplikasi

Kembali ke direktori root proyek, kemudian jalankan:

```bash
pnpm --filter web dev
```

Buka aplikasi melalui:

**http://localhost:3000**

## 🔐 Autentikasi

LinkNest menggunakan Better Auth untuk mengelola autentikasi dan sesi pengguna, dengan PostgreSQL sebagai database serta Prisma sebagai lapisan akses data.

Endpoint autentikasi ditangani melalui:

```text
/api/auth/[...all]
```

Endpoint bookmark tersedia melalui:

```text
/api/bookmarks
```

Operasi bookmark memerlukan sesi pengguna yang valid. Server mengambil identitas pengguna dari sesi autentikasi untuk membatasi akses terhadap bookmark miliknya.

## 🎨 Desain

LinkNest menggunakan pendekatan **Retro Neo-Brutalism** dengan karakteristik:

- Palet warna krem, espresso, olive, terracotta, dan mustard.
- Border tegas dan bayangan bergaya neo-brutalism.
- Komponen dengan sudut membulat sederhana.
- Tema terang dan gelap.
- Layout responsif untuk berbagai ukuran layar.

## 🗺️ Rencana Pengembangan

Beberapa pengembangan yang direncanakan:

- [ ] Login menggunakan Google.
- [ ] Login menggunakan GitHub.
- [ ] Fitur lupa dan reset password.
- [ ] Verifikasi email.
- [ ] Penyempurnaan keamanan dan pengalaman autentikasi.
- [ ] Deployment ke lingkungan produksi.

Status setiap fitur dapat diperbarui seiring perkembangan proyek.

## 🔒 Keamanan

- Simpan kredensial database dan secret autentikasi di environment variables.
- Jangan pernah mengunggah file `.env` ke repositori publik.
- Lakukan pemeriksaan sesi di server untuk setiap endpoint yang memerlukan autentikasi.
- Batasi operasi data berdasarkan kepemilikan pengguna.
- Gunakan HTTPS dan konfigurasi cookie yang aman pada deployment produksi.

## 📄 Lisensi

Lisensi proyek belum ditentukan. Tambahkan file `LICENSE` jika proyek akan dibagikan atau digunakan oleh pihak lain dengan ketentuan tertentu.

---

**LinkNest** — Semua tautan pentingmu, tersusun dalam satu sarang. 🌱
