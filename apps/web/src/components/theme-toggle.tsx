"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"
      }
      title={theme === "light" ? "Mode gelap" : "Mode terang"}
      className="retro-button fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition hover:scale-105"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--foreground)",
        borderColor: "var(--border)",
      }}
    >
      <span aria-hidden="true" className="text-xl">
        {theme === "light" ? (
          <Moon size={20} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Sun size={20} strokeWidth={2.5} aria-hidden="true" />
        )}{" "}
      </span>
    </button>
  );
}
