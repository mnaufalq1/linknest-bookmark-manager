// Middleware untuk melindungi halaman yang membutuhkan autentikasi
// Mengecek keberadaan cookie sesi Better Auth
// Catatan: Ini hanya perlindungan di level navigasi (UX),
// validasi sesi yang sebenarnya tetap harus dilakukan di server component

import { NextRequest, NextResponse } from "next/server";

// Daftar halaman yang membutuhkan login
const halamanDilindungi = ["/dashboard"];

// Daftar halaman autentikasi (login/register)
const halamanAuth = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek cookie sesi dari Better Auth
  const cookieSesi =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const sudahLogin = !!cookieSesi;

  // Jika mengakses halaman yang dilindungi tapi belum login → arahkan ke /login
  const diHalamanDilindungi = halamanDilindungi.some(
    (halaman) => pathname === halaman || pathname.startsWith(halaman + "/"),
  );

  if (diHalamanDilindungi && !sudahLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login tapi mengakses halaman auth → arahkan ke /dashboard
  if (halamanAuth.includes(pathname) && sudahLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi route mana saja yang dijalankan middleware ini
export const config = {
  matcher: [
    // Halaman bookmark manager (dilindungi)
    "/dashboard/:path*",
    // Halaman autentikasi
    "/login",
    "/register",
  ],
};
