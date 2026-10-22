// Auth client untuk sisi frontend (client-side)
// Digunakan di komponen React untuk mengelola autentikasi
// seperti: masuk, daftar, keluar, dan cek sesi

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
});

// Ekspor fungsi dan hook yang sering dipakai
// agar import di komponen lebih ringkas
export const { signIn, signUp, signOut, useSession } = authClient;
