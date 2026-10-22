# LinkNest - Project Tasks & Roadmap

> Dokumen ini menjadi sumber acuan utama untuk seluruh pekerjaan pengembangan LinkNest.
> Semua pengerjaan harus mengikuti kondisi kode aktual, kebutuhan proyek, dan checklist di bawah ini.

## 1. Informasi Proyek

- **Nama:** LinkNest
- **Jenis:** Bookmark Manager
- **Tujuan:** Membantu pengguna menyimpan, mengelola, mencari, dan mengelompokkan tautan secara terorganisasi.
- **Frontend & Backend:** Next.js App Router
- **Bahasa:** TypeScript
- **Package Manager:** pnpm
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Deployment Target:** Vercel, dengan mempertimbangkan kompatibilitas seluruh dependensi.

## 2. Aturan Utama Pengembangan

- [ ] Baca `README.md`, `task.md`, `package.json`, dan konfigurasi proyek sebelum mengerjakan tugas.
- [ ] Periksa implementasi yang sudah ada sebelum membuat atau mengubah file.
- [ ] Jangan mengasumsikan struktur folder, nama fungsi, schema, endpoint, atau komponen. Verifikasi langsung dari kode aktual.
- [ ] Jangan menulis ulang fitur yang sudah bekerja tanpa alasan teknis yang jelas.
- [ ] Jangan menambahkan fitur di luar scope task yang sedang dikerjakan.
- [ ] Jangan mengganti library, framework, atau arsitektur tanpa persetujuan.
- [ ] Jangan menghapus, mengganti nama, atau memindahkan file tanpa menjelaskan dampaknya.
- [ ] Gunakan TypeScript dengan tipe yang jelas. Hindari `any` jika tipe yang sesuai dapat ditentukan.
- [ ] Ikuti konvensi penamaan dan pola kode yang sudah digunakan proyek.
- [ ] Jangan menaruh secret, password, atau connection string asli ke dalam source code maupun dokumentasi.
- [ ] Jangan menjalankan perintah yang berpotensi menghapus data, reset database, atau menghilangkan perubahan pengguna tanpa persetujuan.
- [ ] Jangan mengklaim task selesai sebelum melakukan pemeriksaan yang relevan.

### Prosedur Sebelum Mengubah Kode

1. Periksa file dan implementasi yang berkaitan dengan task.
2. Jelaskan kondisi kode saat ini secara singkat.
3. Identifikasi file yang perlu diubah dan alasannya.
4. Jelaskan rencana perubahan serta potensi dampaknya.
5. Jika ada keputusan arsitektur atau kebutuhan yang belum jelas, tanyakan terlebih dahulu.
6. Implementasikan hanya scope yang disepakati.
7. Jalankan pemeriksaan yang sesuai dan laporkan hasil sebenarnya.

Untuk perubahan kecil yang sudah jelas, pemeriksaan dan implementasi dapat dilakukan dalam satu sesi tanpa membuat laporan panjang terlebih dahulu.

---

## 3. Kondisi Awal Proyek

Bagian ini harus diverifikasi terhadap kode aktual sebelum task baru dimulai.

- [x] Struktur monorepo pnpm telah dibuat.
- [x] Aplikasi Next.js berada di `apps/web`.
- [x] Package bersama berada di `packages/shared`.
- [x] PostgreSQL lokal telah dipasang.
- [x] Database `linknest` telah dibuat.
- [x] Prisma 7 telah dikonfigurasi.
- [x] Prisma Client berhasil di-generate.
- [x] Schema Prisma berhasil divalidasi.
- [x] Sinkronisasi database telah dilakukan.
- [x] Konfigurasi koneksi Prisma telah dibuat di `prisma.ts`.
- [x] Endpoint `/api/bookmarks` telah dibuat.
- [x] Pengujian POST bookmark berhasil dilakukan.
- [x] Audit ulang seluruh implementasi yang sudah tersedia sebelum melanjutkan pengembangan.

**Catatan:** Checklist di atas mencatat progres yang telah dilaporkan. Status implementasi tetap perlu diperiksa jika ada perubahan kode setelahnya.

---

## 4. Roadmap Pengembangan

### Phase 1: Audit dan Fondasi Proyek

Tujuan: Memastikan struktur, konfigurasi, dan kode dasar proyek konsisten.

- [x] Periksa struktur direktori monorepo.
- [x] Periksa konfigurasi workspace pnpm.
- [x] Periksa script pada root dan `apps/web/package.json`.
- [x] Periksa versi Next.js, React, TypeScript, Prisma, dan dependensi terkait.
- [x] Periksa konfigurasi environment variables.
- [x] Periksa konfigurasi Prisma 7 dan adapter database.
- [x] Periksa model database serta migration yang tersedia.
- [x] Periksa endpoint API dan penanganan error.
- [x] Periksa komponen UI serta custom hook yang sudah dibuat.
- [x] Perbaiki masalah fondasi yang terbukti ada.
- [x] Pastikan aplikasi dapat dijalankan dan build berhasil.

**Kriteria selesai:**
- Struktur proyek dipahami dan terdokumentasi.
- Tidak ada perubahan arsitektur tanpa persetujuan.
- Masalah fondasi yang ditemukan sudah diperbaiki atau dicatat sebagai blocker.

### Phase 2: Penyempurnaan CRUD Bookmark

Tujuan: Memastikan seluruh operasi bookmark bekerja dengan database.

- [x] Periksa operasi Create bookmark.
- [x] Periksa operasi Read bookmark.
- [x] Implementasikan atau perbaiki Update bookmark.
- [x] Implementasikan atau perbaiki Delete bookmark.
- [x] Validasi judul dan URL.
- [x] Validasi data kategori serta deskripsi.
- [x] Tangani URL tidak valid dan input kosong.
- [x] Tangani bookmark yang tidak ditemukan.
- [x] Gunakan respons API yang konsisten.
- [x] Pastikan error database tidak membocorkan informasi sensitif.
- [x] Uji setiap operasi terhadap PostgreSQL.
- [x] Pastikan data tetap tersimpan setelah aplikasi dijalankan ulang.

**Kriteria selesai:**
- Operasi CRUD berjalan sesuai kebutuhan.
- Perubahan data tercermin di database.
- Input tidak valid ditangani dengan benar.
- Tidak ada klaim sukses palsu ketika operasi gagal.

### Phase 3: Integrasi Frontend dan Backend

Tujuan: Menghubungkan UI LinkNest dengan data bookmark yang sebenarnya.

- [x] Periksa implementasi `use-bookmarks.ts`.
- [x] Periksa `page.tsx`, `BookmarkGrid`, dan `bookmark-form.tsx`.
- [x] Periksa alur pembukaan dan penutupan modal.
- [x] Hubungkan daftar bookmark dengan data API.
- [x] Hubungkan formulir tambah bookmark.
- [x] Hubungkan fitur edit bookmark.
- [x] Hubungkan fitur hapus bookmark.
- [x] Perbarui tampilan setelah operasi berhasil.
- [x] Tambahkan loading state saat mengambil atau mengubah data.
- [x] Tambahkan empty state ketika belum ada bookmark.
- [x] Tampilkan pesan error ketika permintaan gagal.
- [x] Cegah pengiriman formulir berulang ketika request sedang berjalan.
- [x] Pastikan state UI tetap konsisten dengan data server.

**Kriteria selesai:**
- UI menggunakan data database, bukan data dummy sebagai sumber utama.
- Operasi pengguna memberikan umpan balik yang sesuai.
- Modal dan formulir bekerja konsisten.
- Error jaringan tidak membuat UI berada dalam kondisi rusak.

### Phase 4: Pencarian, Kategori, dan Pengelolaan Bookmark

Tujuan: Memudahkan pengguna menemukan dan mengatur tautan.

- [x] Implementasikan pencarian bookmark berdasarkan judul.
- [x] Periksa apakah pencarian berdasarkan URL dan deskripsi diperlukan.
- [x] Implementasikan filter kategori.
- [x] Tambahkan pilihan untuk menampilkan semua bookmark.
- [x] Implementasikan pengurutan jika dibutuhkan.
- [x] Implementasikan fitur favorit menggunakan field yang sudah tersedia.
- [x] Implementasikan arsip menggunakan field yang sudah tersedia.
- [x] Pastikan kombinasi pencarian dan filter berjalan dengan benar.
- [x] Tampilkan empty state ketika hasil pencarian kosong.

**Kriteria selesai:**
- Pencarian dan filter menghasilkan data yang benar.
- Perubahan filter tidak merusak state bookmark.
- Favorit dan arsip tersimpan secara persisten di database.

### Phase 5: Penyempurnaan UI/UX

Tujuan: Membuat LinkNest nyaman dipakai di berbagai ukuran layar.

- [x] Audit tampilan dashboard yang sudah ada.
- [x] Pertahankan tema light dan dark sebagai dua mode utama.
- [x] Pastikan pergantian tema bekerja dengan benar.
- [x] Pastikan preferensi tema dipertahankan sesuai mekanisme yang digunakan.
- [x] Periksa tampilan desktop, tablet, dan mobile.
- [x] Perbaiki layout ketika jumlah bookmark banyak.
- [x] Periksa konsistensi spacing, tipografi, warna, dan komponen.
- [x] Periksa aksesibilitas tombol dan formulir.
- [x] Pastikan modal dapat ditutup dengan cara yang sesuai.
- [x] Tambahkan notifikasi keberhasilan dan kegagalan jika belum tersedia.
- [x] Pastikan indikator interaksi dan loading state terlihat jelas.

**Kriteria selesai:**
- Tampilan responsif dan konsisten.
- Tema light dan dark dapat digunakan tanpa masalah.
- Elemen interaktif mudah digunakan dengan mouse maupun keyboard.

### Phase 6: Validasi, Testing, dan Keamanan

Tujuan: Mengurangi bug sebelum aplikasi dipublikasikan.

- [x] Audit validasi input di sisi server.
- [x] Pastikan endpoint hanya menerima metode HTTP yang sesuai.
- [x] Pastikan error API memiliki status HTTP yang tepat.
- [x] Periksa penggunaan Prisma Client dan koneksi database.
- [x] Periksa kebocoran informasi melalui log dan respons error.
- [x] Tambahkan unit test untuk fungsi penting.
- [x] Tambahkan integration test untuk endpoint bookmark jika memungkinkan.
- [x] Uji seluruh operasi CRUD.
- [x] Uji input kosong dan URL tidak valid.
- [x] Uji pencarian, filter, favorit, dan arsip.
- [x] Uji kondisi database tidak tersedia.
- [x] Jalankan lint, typecheck, test, dan build menggunakan script yang benar-benar tersedia.
- [x] Perbaiki regresi yang ditemukan.

**Kriteria selesai:**
- Pemeriksaan yang relevan lulus.
- Tidak ada bug kritis yang diketahui dan belum ditangani.
- Hasil pengujian dilaporkan berdasarkan hasil aktual.

### Phase 7: Autentikasi dan Kepemilikan Data

Tujuan: Mempersiapkan LinkNest untuk digunakan oleh beberapa pengguna.

**Tahap ini memerlukan persetujuan sebelum implementasi.**

- [x] Tentukan kebutuhan autentikasi (Email/Password & Social OAuth).
- [x] Tentukan penyedia autentikasi setelah membandingkan kebutuhan dan dependensi (Better Auth).
- [x] Audit schema autentikasi jika sudah tersedia (`User`, `Account`, `Session`, `Verification`).
- [x] Tentukan relasi antara pengguna dan bookmark (`Bookmark.userId -> User.id`).
- [x] Tentukan aturan kepemilikan dan akses data.
- [x] Sederhanakan alur kredensial: hilangkan opsi lupa password dari halaman login.
- [x] Implementasikan registrasi dan login sesuai scope (Email/Password + tombol Google & GitHub OAuth).
- [x] Lindungi endpoint yang memerlukan autentikasi.
- [x] Pastikan pengguna hanya dapat mengakses bookmark miliknya.
- [x] Tambahkan pengujian akses tanpa autentikasi.
- [x] Tambahkan pengujian akses lintas pengguna.

**Kriteria selesai:**
- Autentikasi bekerja sesuai mekanisme yang dipilih.
- Akses data pengguna diperiksa di sisi server.
- Bookmark tidak dapat diakses atau diubah oleh pengguna yang tidak berhak.

### Phase 8: Deployment

Tujuan: Menjalankan LinkNest di lingkungan produksi.

- [x] Verifikasi kompatibilitas proyek dengan Vercel.
- [x] Pilih penyedia PostgreSQL produksi (Supabase / Neon / Railway dengan connection pooler).
- [x] Konfigurasikan environment variables produksi.
- [x] Periksa konfigurasi Prisma untuk deployment (`prisma generate && next build`).
- [x] Pastikan migration produksi dapat dijalankan dengan aman (`pnpm migrate:deploy`).
- [x] Pastikan build produksi berhasil.
- [ ] Deploy aplikasi ke lingkungan staging atau preview (langkah user di Vercel).
- [ ] Uji operasi CRUD menggunakan database produksi atau staging.
- [ ] Periksa log dan penanganan error.
- [ ] Uji autentikasi jika sudah diimplementasikan.
- [x] Dokumentasikan langkah deployment dan rollback (DEPLOYMENT.md).
- [ ] Publikasikan aplikasi setelah pemeriksaan selesai.

**Kriteria selesai:**
- Aplikasi dapat diakses melalui URL deployment.
- Koneksi database produksi berfungsi.
- Environment variables tidak terekspos ke browser.
- Fitur yang sudah dinyatakan selesai berfungsi di lingkungan deployment.

---

## 5. Fitur Opsional

Fitur berikut bukan prioritas sampai fondasi aplikasi stabil.

- [ ] Import dan export bookmark.
- [ ] Favicon otomatis berdasarkan URL.
- [ ] Tag khusus untuk bookmark.
- [ ] Tampilan grid dan list.
- [ ] Shortcut keyboard.
- [ ] Deteksi URL duplikat jika diperlukan.
- [ ] Pagination atau infinite scrolling ketika jumlah data meningkat.
- [ ] Statistik bookmark.
- [ ] PWA atau dukungan instalasi aplikasi.

Fitur opsional harus dinilai berdasarkan manfaat, kompleksitas, keamanan, dan biaya pemeliharaannya sebelum dikerjakan.

---

## 6. Prioritas Pengerjaan

| Prioritas | Fokus | Target |
|---|---|---|
| P0 | Audit fondasi | Memahami dan menstabilkan implementasi yang ada |
| P1 | CRUD bookmark | Operasi data berjalan dengan benar |
| P2 | Integrasi UI dan API | Seluruh interaksi memakai data nyata |
| P3 | Pencarian dan pengelolaan | Bookmark mudah ditemukan |
| P4 | UI/UX dan pengujian | Pengalaman penggunaan stabil |
| P5 | Autentikasi | Data pengguna terlindungi |
| P6 | Deployment | Aplikasi siap dipublikasikan |
| P7 | Fitur opsional | Pengembangan lanjutan |

Urutan ini dapat berubah jika hasil audit menemukan masalah yang menghalangi pekerjaan berikutnya.

## 7. Format Pelaporan Setiap Task

Setiap task harus memiliki informasi berikut:

- **Task:** Nama pekerjaan.
- **Tujuan:** Masalah yang ingin diselesaikan.
- **Kondisi awal:** Implementasi yang ditemukan.
- **File terdampak:** Daftar file aktual yang akan diubah.
- **Perubahan:** Ringkasan implementasi.
- **Validasi:** Pemeriksaan yang dilakukan.
- **Hasil:** Lulus, gagal, atau terblokir.
- **Risiko:** Dampak yang perlu diketahui.
- **Checklist:** Status pekerjaan yang diperbarui.

Jangan menandai task selesai hanya karena kode sudah ditulis. Verifikasi hasilnya terlebih dahulu.

## 8. Aturan Pembaruan Dokumen

- [ ] Perbarui checklist setelah task benar-benar selesai.
- [ ] Catat blocker dan alasan task tertunda.
- [ ] Jangan menghapus task yang belum selesai hanya untuk membuat progres terlihat bagus.
- [ ] Jika scope berubah, jelaskan perubahan dan alasannya.
- [ ] Jika ditemukan kebutuhan baru, masukkan ke backlog terlebih dahulu.
- [ ] Jangan menandai fitur opsional sebagai wajib tanpa persetujuan.

---

## 9. Task Aktif Berikutnya

**Task ID:** LN-008

**Nama:** Deployment

**Tujuan:** Menyiapkan konfigurasi deployment (Vercel / Node container), mengaudit environment variables produksi, memverifikasi kompatibilitas Prisma Client di serverless/production, dan mendokumentasikan langkah deployment & rollback.

Checklist:

- [x] Verifikasi kompatibilitas proyek dengan Vercel atau target deployment.
- [x] Pilih penyedia PostgreSQL produksi (misal: Supabase, Neon, Railway).
- [x] Konfigurasikan environment variables produksi (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`).
- [x] Periksa konfigurasi Prisma untuk deployment (`prisma generate` saat build).
- [x] Pastikan migration produksi dapat dijalankan dengan aman (`pnpm migrate:deploy`).
- [x] Pastikan build produksi berhasil (`pnpm build` sukses).
- [ ] Deploy aplikasi ke lingkungan staging atau preview (langkah user mengimpor repo ke Vercel).
- [ ] Uji operasi CRUD menggunakan database produksi atau staging.
- [ ] Periksa log dan penanganan error.
- [ ] Uji autentikasi pada domain produksi.
- [x] Dokumentasikan langkah deployment dan rollback ([DEPLOYMENT.md](file:///c:/Users/HP/proyek-development/my-bookmark-manager/DEPLOYMENT.md)).
- [ ] Publikasikan aplikasi setelah pemeriksaan selesai.

**Batasan:** Tidak membocorkan credentials atau secrets produksi ke repositori publik; tidak menjalankan migrasi destruktif tanpa konfirmasi.

**Kriteria selesai:** Aplikasi dapat diakses via URL deployment, database produksi terhubung aman, dan seluruh alur autentikasi serta CRUD berfungsi.
