import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeToggle } from "../components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkNest | Bookmark Manager",
  description: "Simpan, atur, dan temukan kembali link favoritmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}

        <Toaster
          position="bottom-right"
          duration={3000}
          theme="system"
          richColors={false}
          closeButton
          toastOptions={{
            className: "linknest-toast",
            style: {
              border: "2px solid var(--toast-border, #332F28)",
              borderRadius: "10px",
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
