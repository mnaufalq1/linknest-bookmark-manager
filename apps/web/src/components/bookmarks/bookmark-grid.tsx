import { BookmarkCard } from "./bookmark-card";
import type { Bookmark } from "./bookmark-card";
import { ArchiveX } from "lucide-react";

type BookmarkGridProps = {
  bookmarks: Bookmark[];
  onToggleFavorite: (id: number) => void;
  onToggleArchive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (bookmark: Bookmark) => void;
};

export function BookmarkGrid({
  bookmarks,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onEdit,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed px-5 py-16 text-center"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mb-3 flex justify-center">
          <ArchiveX size={50} strokeWidth={1.8} />
        </div>
        <h3 className="font-semibold">Bookmark belum ditemukan</h3>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          Coba kata kunci atau kategori lain.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onToggleFavorite={onToggleFavorite}
          onToggleArchive={onToggleArchive}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
