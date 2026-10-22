"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import PasswordInput from "@/components/ui/password-input";
import { FormMessage } from "@/components/ui/form-message";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk loading dan error
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState("");

  // Fungsi untuk menangani login
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSedangMemuat(true);
    setPesanError("");

    try {
      const res = await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
            setSedangMemuat(false);
            setPesanError(ctx.error.message || "Email atau password salah.");
          },
        },
      );

      if (res?.data && !res?.error) {
        window.location.href = "/dashboard";
        return;
      }

      if (res?.error) {
        setSedangMemuat(false);
        setPesanError(res.error.message || "Email atau password salah.");
      }
    } catch (err: unknown) {
      setSedangMemuat(false);
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      setPesanError(msg);
    }
  }

  // Fungsi untuk masuk dengan Google atau GitHub
  async function handleSocialLogin(provider: "google" | "github") {
    setPesanError("");
    setSedangMemuat(true);

    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      setSedangMemuat(false);
      const msg =
        err instanceof Error
          ? err.message
          : `Gagal menghubungkan ke akun ${provider}.`;
      setPesanError(msg);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft size={16} />
          Kembali ke beranda
        </Link>

        <div className="grid min-h-[80vh] items-center gap-10 py-10 md:grid-cols-2">
          {/* Bagian pengenalan */}
          <section className="hidden md:block">
            <div className="mb-6 inline-flex items-center gap-2 border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-bold shadow-[3px_3px_0_var(--foreground)]">
              <Bookmark size={18} />
              LinkNest
            </div>

            <h1 className="max-w-lg text-5xl font-black leading-tight tracking-tight lg:text-6xl">
              Semua link pentingmu,
              <span className="text-[var(--accent)]"> satu tempat.</span>
            </h1>

            <p className="mt-5 max-w-md leading-7 text-[var(--muted-foreground)]">
              Masuk kembali dan lanjutkan menata dunia digitalmu. Tidak perlu
              berburu link di antara puluhan tab browser.
            </p>

            <div className="retro-card mt-8 max-w-md bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center border-2 border-[var(--border)] bg-[var(--surface-muted)]">
                  <LockKeyhole size={22} />
                </div>
                <div>
                  <p className="font-black">Ruang link milikmu</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Rapi, mudah dicari, dan siap dibuka.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Form login */}
          <section className="retro-card mx-auto w-full max-w-md bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-6 grid size-12 place-items-center border-2 border-[var(--foreground)] bg-[var(--accent)] shadow-[3px_3px_0_var(--foreground)]">
              <Bookmark size={24} />
            </div>

            <p className="retro-label mb-3">SELAMAT DATANG KEMBALI</p>

            <h2 className="text-3xl font-black tracking-tight">
              Masuk ke LinkNest
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Masukkan akunmu untuk melanjutkan.
            </p>

            {/* Pesan error global */}
            <FormMessage message={pesanError} type="error" />

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >
              <div>
                <label htmlFor="email" className="retro-label mb-2 block">
                  EMAIL
                </label>

                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="retro-input w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="retro-label mb-2 block">
                  PASSWORD
                </label>

                <div className="relative">
                  <PasswordInput
                    name="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sedangMemuat}
                className="retro-button flex w-full items-center justify-center gap-2 bg-[var(--accent)] px-5 py-3 font-black disabled:opacity-50"
              >
                {sedangMemuat ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sedang masuk...
                  </>
                ) : (
                  <>
                    Masuk sekarang
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Pembatas Social Login */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-[var(--border)]" />
              </div>
              <span className="relative bg-[var(--surface)] px-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                atau masuk dengan
              </span>
            </div>

            {/* Tombol Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={sedangMemuat}
                className="retro-button flex items-center justify-center gap-2 border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-black transition hover:scale-[1.02] disabled:opacity-50"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={sedangMemuat}
                className="retro-button flex items-center justify-center gap-2 border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-black transition hover:scale-[1.02] disabled:opacity-50"
              >
                <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="my-6 border-t-2 border-dashed border-[var(--border)]" />

            <p className="text-center text-sm text-[var(--muted-foreground)]">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-black text-[var(--foreground)] underline decoration-2 underline-offset-4"
              >
                Daftar di sini
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
