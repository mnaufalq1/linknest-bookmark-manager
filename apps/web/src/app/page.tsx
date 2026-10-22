import Link from "next/link";
import {
  Archive,
  ArrowDownRight,
  ArrowRight,
  Bookmark,
  Check,
  Code2,
  Heart,
  LayoutGrid,
  Link2,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const contohBookmark = [
  {
    icon: "⌘",
    title: "Dokumentasi Next.js",
    url: "nextjs.org/docs",
    kategori: "Development",
    warna: "#D9E8C5",
  },
  {
    icon: "◈",
    title: "Inspirasi Desain",
    url: "mobbin.com",
    kategori: "Desain",
    warna: "#F4D7B5",
  },
  {
    icon: "◉",
    title: "Belajar TypeScript",
    url: "typescriptlang.org",
    kategori: "Belajar",
    warna: "#D4DDF7",
  },
];

const fitur = [
  {
    nomor: "01",
    icon: Bookmark,
    judul: "Simpan sekali, temukan lagi",
    deskripsi:
      "Kumpulkan artikel, dokumentasi, video, dan berbagai tautan penting tanpa menumpuk tab browser.",
    warna: "#D9E8C5",
  },
  {
    nomor: "02",
    icon: LayoutGrid,
    judul: "Rapi sesuai caramu",
    deskripsi:
      "Kelompokkan bookmark berdasarkan kategori agar koleksi link tetap teratur dan mudah dijelajahi.",
    warna: "#F4D7B5",
  },
  {
    nomor: "03",
    icon: Heart,
    judul: "Tandai yang paling penting",
    deskripsi:
      "Simpan link favorit dan arsipkan yang belum diperlukan tanpa harus menghapusnya.",
    warna: "#D4DDF7",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* NAVBAR */}
      <header className="relative z-10 border-b-2 border-[var(--retro-outline)] bg-[var(--surface)]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center border-2 border-[var(--retro-outline)] bg-[var(--retro-olive)] text-white shadow-[3px_3px_0_var(--retro-outline)]">
              <Bookmark size={23} strokeWidth={2.5} />
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight">
                LinkNest
                <span className="text-[var(--retro-terracotta)]">.</span>
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] sm:block">
                Sarang tautanmu
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold md:flex">
            <a className="transition hover:underline" href="#fitur">
              Fitur
            </a>
            <a className="transition hover:underline" href="#cara-kerja">
              Cara Kerja
            </a>
            <a className="transition hover:underline" href="#tentang">
              Tentang
            </a>
          </div>

          <Link
            href="/login"
            className="retro-button inline-flex items-center gap-2 bg-[var(--retro-mustard)] px-4 py-2.5 text-sm font-black"
          >
            Login <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex rotate-[-2deg] items-center gap-2 border-2 border-[var(--retro-outline)] bg-[var(--retro-mustard)] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[4px_4px_0_var(--retro-outline)]">
            <Sparkles size={15} />
            Selamat tinggal, tab berantakan!
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Semua link.
            <br />
            Satu{" "}
            <span className="relative inline-block">
              sarang
              <span className="absolute bottom-1 left-0 -z-10 h-4 w-full -rotate-2 bg-[var(--retro-olive)] sm:h-6" />
            </span>
            <span className="text-[var(--retro-terracotta)]">.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            Artikel penting, referensi coding, inspirasi desain, sampai link
            favorit. Simpan semuanya di satu tempat dan temukan kembali saat
            kamu membutuhkannya.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="retro-button inline-flex items-center gap-3 bg-[var(--retro-olive)] px-6 py-4 font-black text-white"
            >
              Mulai Menjelajah <ArrowRight size={19} />
            </Link>

            <a
              href="#fitur"
              className="retro-button inline-flex items-center gap-2 bg-[var(--surface)] px-6 py-4 font-black"
            >
              Kenali Fiturnya <ArrowDownRight size={19} />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-2">
              <Check size={15} /> Simpel dan terorganisasi
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={15} /> Tampilan retro
            </span>
          </div>
        </div>

        {/* MOCKUP BROWSER, DIBUAT DENGAN KODE */}
        <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div className="absolute -right-3 -top-5 z-10 rotate-12 border-2 border-[var(--retro-outline)] bg-[var(--retro-terracotta)] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0_var(--retro-outline)] sm:-right-5">
            LINK IT. LOVE IT.
          </div>

          <div className="absolute -bottom-5 -left-3 z-10 flex h-16 w-16 -rotate-12 items-center justify-center border-2 border-[var(--retro-outline)] bg-[var(--retro-mustard)] shadow-[4px_4px_0_var(--retro-outline)] sm:-left-6">
            <Star size={32} strokeWidth={2.5} />
          </div>

          <div className="retro-card overflow-hidden bg-[var(--surface)]">
            {/* Bilah browser */}
            <div className="flex items-center gap-3 border-b-2 border-[var(--retro-outline)] bg-[var(--surface-muted)] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full border border-[var(--retro-outline)] bg-[var(--retro-terracotta)]" />
                <span className="h-3 w-3 rounded-full border border-[var(--retro-outline)] bg-[var(--retro-mustard)]" />
                <span className="h-3 w-3 rounded-full border border-[var(--retro-outline)] bg-[var(--retro-olive)]" />
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 border border-[var(--retro-outline)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                <Link2 size={13} />
                <span className="truncate">linknest.app/dashboard</span>
              </div>
            </div>

            {/* Isi dashboard */}
            <div className="grid min-h-[370px] sm:grid-cols-[135px_1fr]">
              <aside className="hidden border-r-2 border-[var(--retro-outline)] bg-[var(--surface-muted)] p-3 sm:block">
                <div className="mb-7 flex items-center gap-2 px-1">
                  <span className="flex h-8 w-8 items-center justify-center border-2 border-[var(--retro-outline)] bg-[var(--retro-olive)] text-white">
                    <Bookmark size={16} />
                  </span>
                  <span className="text-sm font-black">LinkNest</span>
                </div>

                <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                  Koleksi
                </p>

                <div className="mb-1 flex items-center gap-2 border-2 border-[var(--retro-outline)] bg-[var(--retro-mustard)] px-2 py-2 text-[10px] font-black">
                  <LayoutGrid size={13} /> Semua Link
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-bold">
                  <Heart size={13} /> Favorit
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-bold">
                  <Archive size={13} /> Arsip
                </div>
              </aside>

              <div className="min-w-0 p-4 sm:p-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                      Ruang pribadimu
                    </p>
                    <h2 className="mt-1 text-xl font-black sm:text-2xl">
                      Koleksi Link
                    </h2>
                  </div>

                  <span className="flex shrink-0 items-center gap-1.5 border-2 border-[var(--retro-outline)] bg-[var(--retro-olive)] px-2.5 py-2 text-[10px] font-black text-white">
                    <Zap size={13} /> Terorganisasi
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  <div className="border-2 border-[var(--retro-outline)] bg-[#D9E8C5] p-3 text-[#332F28] shadow-[2px_2px_0_var(--retro-outline)]">
                    <LayoutGrid size={16} />
                    <p className="mt-3 text-xl font-black">24</p>
                    <p className="text-[9px] font-bold">Semua Link</p>
                  </div>
                  <div className="border-2 border-[var(--retro-outline)] bg-[#F4D7B5] p-3 text-[#332F28] shadow-[2px_2px_0_var(--retro-outline)]">
                    <Heart size={16} />
                    <p className="mt-3 text-xl font-black">08</p>
                    <p className="text-[9px] font-bold">Favorit</p>
                  </div>
                  <div className="border-2 border-[var(--retro-outline)] bg-[#D4DDF7] p-3 text-[#332F28] shadow-[2px_2px_0_var(--retro-outline)]">
                    <Archive size={16} />
                    <p className="mt-3 text-xl font-black">03</p>
                    <p className="text-[9px] font-bold">Arsip</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 border-2 border-[var(--retro-outline)] bg-[var(--background)] px-3 py-2.5">
                  <Search
                    size={15}
                    className="text-[var(--muted-foreground)]"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Cari link kesayanganmu...
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black">Baru disimpan</h3>
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    Lihat semua
                  </span>
                </div>

                <div className="space-y-2.5">
                  {contohBookmark.map((item) => (
                    <div
                      key={item.title}
                      className="flex min-w-0 items-center gap-3 border-2 border-[var(--retro-outline)] bg-[var(--surface)] p-3 shadow-[2px_2px_0_var(--retro-outline)]"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--retro-outline)] text-lg font-black text-[#332F28]"
                        style={{ backgroundColor: item.warna }}
                      >
                        {item.icon}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black">
                          {item.title}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-[var(--muted-foreground)]">
                          {item.url}
                        </p>
                      </div>

                      <span className="hidden shrink-0 border border-[var(--retro-outline)] bg-[var(--surface-muted)] px-2 py-1 text-[9px] font-bold sm:block">
                        {item.kategori}
                      </span>

                      <Heart size={14} className="shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] p-3 text-[10px] font-bold text-[var(--muted-foreground)]">
                  <Code2 size={14} /> Semua referensimu, tertata rapi.
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] font-bold text-[var(--muted-foreground)]">
            *Pratinjau ilustratif. Data di atas merupakan contoh.
          </p>
        </div>
      </section>

      {/* PEMISAH RETRO */}
      <div className="border-y-2 border-[var(--retro-outline)] bg-[var(--retro-mustard)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-4 text-center text-xs font-black uppercase tracking-widest sm:justify-between sm:px-8">
          <span>Simpan dengan mudah</span>
          <span className="hidden sm:block">✳</span>
          <span>Temukan dengan cepat</span>
          <span className="hidden sm:block">✳</span>
          <span>Atur sesukamu</span>
        </div>
      </div>

      {/* FITUR */}
      <section
        id="fitur"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--retro-terracotta)]">
              Bukan sekadar bookmark
            </p>
            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Ruang kecil untuk semua hal penting.
            </h2>
          </div>

          <p className="max-w-md leading-7 text-[var(--muted-foreground)] md:justify-self-end">
            Tidak perlu mengingat semua alamat situs. Cukup simpan, kelompokkan,
            dan biarkan LinkNest membantumu menemukan kembali semuanya.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {fitur.map((item) => {
            const Ikon = item.icon;

            return (
              <article
                key={item.nomor}
                className="retro-card flex flex-col bg-[var(--surface)] p-6 sm:p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center border-2 border-[var(--retro-outline)] text-[#332F28]"
                    style={{ backgroundColor: item.warna }}
                  >
                    <Ikon size={26} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-black text-[var(--muted-foreground)]">
                    / {item.nomor}
                  </span>
                </div>

                <h3 className="text-xl font-black">{item.judul}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">
                  {item.deskripsi}
                </p>

                <div className="mt-6 border-t-2 border-[var(--border)] pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-black">
                    Biar tetap tertata <ArrowRight size={15} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CARA KERJA */}
      <section
        id="cara-kerja"
        className="border-y-2 border-[var(--retro-outline)] bg-[var(--surface-muted)]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--retro-terracotta)]">
              Tidak pakai ribet
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Tiga langkah. Pikiran lebih lega.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                nomor: "01",
                judul: "Temukan link",
                deskripsi:
                  "Jelajahi internet seperti biasa dan temukan sesuatu yang berguna.",
              },
              {
                nomor: "02",
                judul: "Simpan di LinkNest",
                deskripsi:
                  "Tambahkan judul, alamat, kategori, dan deskripsi seperlunya.",
              },
              {
                nomor: "03",
                judul: "Buka kapan saja",
                deskripsi:
                  "Cari kembali koleksimu, tandai favorit, atau arsipkan yang lama.",
              },
            ].map((item) => (
              <div
                key={item.nomor}
                className="border-2 border-[var(--retro-outline)] bg-[var(--surface)] p-6 shadow-[5px_5px_0_var(--retro-outline)]"
              >
                <span className="mb-8 block text-4xl font-black text-[var(--retro-terracotta)]">
                  {item.nomor}
                </span>
                <h3 className="text-xl font-black">{item.judul}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="tentang"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="retro-card relative overflow-hidden bg-[var(--retro-olive)] p-8 text-white sm:p-12 lg:p-16">
          <div className="absolute -right-8 -top-12 h-48 w-48 rotate-12 border-[12px] border-white/15 sm:h-64 sm:w-64" />
          <div className="absolute -bottom-16 right-36 h-36 w-36 rounded-full border-[12px] border-white/10" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 border-2 border-white bg-white px-3 py-2 text-xs font-black text-[#332F28]">
              <Sparkles size={15} /> WAKTUNYA BERES-BERES LINK
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Bikin internet terasa sedikit lebih rapi.
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-white/85">
              Mulai kumpulkan referensi, ide, dan hal-hal yang ingin kamu
              simpan. Semuanya punya tempat di LinkNest.
            </p>

            <Link
              href="/dashboard"
              className="retro-button mt-8 inline-flex items-center gap-3 bg-[var(--retro-mustard)] px-6 py-4 font-black text-[#332F28]"
            >
              Yuk, Mulai Sekarang <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-[var(--retro-outline)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-black">
            <Bookmark size={19} /> LinkNest.
          </Link>

          <p className="text-xs text-[var(--muted-foreground)]">
            Simpan yang penting. Temukan saat dibutuhkan.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs font-black"
          >
            Kembali ke atas ↑
          </a>
        </div>
      </footer>
    </main>
  );
}
