"use client";

import { useState } from "react";
import { HeartOff, Heart, FolderOpen, X, ExternalLink, Link2, AlertTriangle, Pen } from "lucide-react";

type Bookmark = {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
  icon: string;
  favorite: boolean;
};

type BookmarkCardProps = {
  bookmark: Bookmark;
  onToggleFavorite: (id: number) => void;
  onToggleArchive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (bookmark: Bookmark) => void;
};

export function BookmarkCard({
  bookmark,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onEdit,
}: BookmarkCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleConfirmDelete() {
    onDelete(bookmark.id);
    setIsDeleteDialogOpen(false);
  }

  function handleCardClick(event: React.MouseEvent) {
    if ((event.target as HTMLElement).closest("button, a")) {
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onEdit(bookmark);
    }
  }

  return (
    <>
      <article
        onClick={handleCardClick}
        className="retro-card group flex min-w-0 flex-col p-5 cursor-pointer md:cursor-default transition-all active:scale-[0.99] md:active:scale-100"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
            style={{
              backgroundColor: "var(--surface-muted)",
              color: "var(--accent)",
            }}
          >
            <Link2 size={24} strokeWidth={2.5} />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(bookmark.id);
              }}
              title={
                bookmark.favorite
                  ? "Hapus dari favorit"
                  : "Tambahkan ke favorit"
              }
              aria-label={
                bookmark.favorite
                  ? "Hapus dari favorit"
                  : "Tambahkan ke favorit"
              }
              className="retro-icon-button flex h-9 w-9 items-center justify-center text-xl"
              style={{
                color: bookmark.favorite
                  ? "#ec4899"
                  : "var(--muted-foreground)",
              }}
            >
              {bookmark.favorite ? (
                <HeartOff size={15} color="#ec4899" />
              ) : (
                <Heart size={15} color="var(--muted-foreground)" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive(bookmark.id);
              }}
              title="Arsipkan bookmark"
              aria-label="Arsipkan bookmark"
              className="retro-icon-button flex h-9 w-9 items-center justify-center text-xl"
              style={{ color: "var(--muted-foreground)" }}
            >
              <FolderOpen size={15} color="var(--muted-foreground)" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              title="Hapus bookmark"
              aria-label="Hapus bookmark"
              className="retro-icon-button flex h-9 w-9 items-center justify-center text-xl"
              style={{ color: "var(--muted-foreground)" }}
            >
              <X size={15} color="var(--muted-foreground)" />
            </button>
          </div>
        </div>

        <span
          className="retro-label mb-2 w-fit px-2.5 py-1 text-xs"
          style={{
            backgroundColor: "var(--surface-muted)",
            color: "var(--accent)",
          }}
        >
          {bookmark.category}
        </span>

        <h3 className="mb-1 truncate font-bold">{bookmark.title}</h3>

        <p
          className="mb-3 break-all text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          {bookmark.url}
        </p>

        <p
          className="mb-5 line-clamp-2 flex-1 text-sm leading-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          {bookmark.description}
        </p>

        <div className="flex items-center gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="retro-button flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold"
            style={{ borderColor: "var(--border)" }}
          >
            Buka Website <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(bookmark);
            }}
            title="Edit bookmark"
            aria-label="Edit bookmark"
            className="retro-button hidden md:flex shrink-0 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <Pen size={15} />
            <span>Edit</span>
          </button>
        </div>

        <p
          className="mt-2 text-center text-[11px] font-medium md:hidden"
          style={{ color: "var(--muted-foreground)" }}
        >
          Ketuk kartu untuk mengedit
        </p>
      </article>

      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${bookmark.id}`}
            aria-describedby={`delete-description-${bookmark.id}`}
            className="retro-dialog w-full max-w-md p-5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <div className="mb-4 flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 text-xl"
                style={{
                  backgroundColor: "#B96F5220",
                  borderColor: "#B96F52",
                  color: "#B96F52",
                }}
              >
                <AlertTriangle size={24} strokeWidth={2.5}/>
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id={`delete-title-${bookmark.id}`}
                  className="text-lg font-bold"
                >
                  Hapus bookmark?
                </h2>

                <p
                  id={`delete-description-${bookmark.id}`}
                  className="mt-2 text-sm leading-6"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Kamu akan menghapus{" "}
                  <strong
                    className="break-words"
                    style={{ color: "var(--foreground)" }}
                  >
                    {bookmark.title}
                  </strong>
                  . Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="retro-button px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: "var(--border)" }}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="retro-button px-4 py-2.5 text-sm font-bold text-white"
                style={{
                  backgroundColor: "#B96F52",
                  borderColor: "#332F28",
                }}
              >
                Hapus bookmark
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export type { Bookmark };
