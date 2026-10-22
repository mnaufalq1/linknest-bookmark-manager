"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Bookmark } from "./bookmark-card";
import { X } from "lucide-react";

type BookmarkFormProps = {
  open: boolean;
  categories: string[];
  editBookmark?: Bookmark | null;
  onClose: () => void;
  onSave: (bookmark: Omit<Bookmark, "id" | "favorite">) => void | Promise<void>;
  onUpdate?: (bookmark: Bookmark) => void | Promise<void>;
};

export function BookmarkForm({
  open,
  categories,
  editBookmark,
  onClose,
  onSave,
  onUpdate,
}: BookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Development");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (editBookmark) {
        setTitle(editBookmark.title);
        setUrl(editBookmark.url);
        setCategory(editBookmark.category || "Development");
        setDescription(editBookmark.description || "");
      } else {
        setTitle("");
        setUrl("");
        setCategory(categories.find((item) => item !== "Semua") || "Development");
        setDescription("");
      }
      setError("");

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          onClose();
        }
      }

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, editBookmark, categories, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanUrl = url.trim();
    const normalizedUrl = /^https?:\/\//i.test(cleanUrl)
      ? cleanUrl
      : `https://${cleanUrl}`;

    let parsedUrl: URL;

    // Validasi URL secara terpisah dari proses penyimpanan.
    try {
      parsedUrl = new URL(normalizedUrl);

      if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes(".") ||
        parsedUrl.hostname.startsWith(".") ||
        parsedUrl.hostname.endsWith(".")
      ) {
        throw new Error("URL tidak valid");
      }
    } catch {
      setError("URL tidak valid. Periksa kembali alamat website.");
      return;
    }

    // Simpan ke API/database.
    setIsSaving(true);

    try {
      if (editBookmark && onUpdate) {
        await onUpdate({
          ...editBookmark,
          title: title.trim(),
          url: parsedUrl.toString(),
          category,
          description: description.trim() || "Belum ada deskripsi.",
        });
      } else {
        await onSave({
          title: title.trim(),
          url: parsedUrl.toString(),
          category,
          description: description.trim() || "Belum ada deskripsi.",
          icon: "link",
        });
      }

      onClose();
      setTitle("");
      setUrl("");
      setCategory(categories.find((item) => item !== "Semua") || "Development");
      setDescription("");
    } catch (error) {
      console.error("Gagal menyimpan bookmark:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Bookmark gagal disimpan. Silakan coba lagi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmark-form-title"
        className="retro-dialog my-auto w-full max-w-lg p-5 sm:p-6"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="bookmark-form-title" className="text-xl font-bold">
              {editBookmark ? "Edit Bookmark" : "Tambah Bookmark"}
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              {editBookmark
                ? "Perbarui link bookmark kamu di LinkNest."
                : "Simpan link pentingmu di LinkNest."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="retro-icon-button flex h-9 w-9 items-center justify-center text-xl"
            aria-label="Tutup formulir"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bookmark-title"
              className="mb-2 block text-sm font-medium"
            >
              Judul
            </label>
            <input
              id="bookmark-title"
              required
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Dokumentasi Next.js"
              className="retro-input w-full min-w-0 rounded-md border-2 px-3 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="bookmark-url"
              className="mb-2 block text-sm font-medium"
            >
              URL Website
            </label>
            <input
              id="bookmark-url"
              required
              type="text"
              maxLength={2048}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://nextjs.org"
              className="retro-input w-full min-w-0 rounded-md border-2 px-3 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="bookmark-category"
              className="mb-2 block text-sm font-medium"
            >
              Kategori
            </label>
            <select
              id="bookmark-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="retro-input w-full min-w-0 rounded-md border-2 px-3 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {categories
                .filter((item) => item !== "Semua")
                .map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="bookmark-description"
              className="mb-2 block text-sm font-medium"
            >
              Deskripsi (opsional)
            </label>
            <textarea
              id="bookmark-description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Website ini berguna untuk..."
              className="retro-input w-full min-w-0 rounded-md border-2 px-3 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border-2 border-red-600 bg-red-100 px-3 py-2 text-sm font-semibold text-red-800"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="retro-button bg-[var(--surface)] px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "var(--foreground)" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="retro-button shrink-0 bg-[var(--accent)] px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "var(--background)" }}
            >
              {isSaving
                ? "Menyimpan..."
                : editBookmark
                  ? "Simpan Perubahan"
                  : "Simpan Bookmark"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
