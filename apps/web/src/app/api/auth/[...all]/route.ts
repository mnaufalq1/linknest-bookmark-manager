// Route handler untuk Better Auth
// Menangani semua endpoint autentikasi seperti:
// - /api/auth/sign-in (masuk)
// - /api/auth/sign-up (daftar)
// - /api/auth/sign-out (keluar)
// - /api/auth/session (cek sesi)
// - dan endpoint lainnya

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
