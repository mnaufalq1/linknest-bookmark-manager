import { BookmarkCard } from "./bookmark-card";
import type { Bookmark } from "./bookmark-card";
import { ArchiveX, BookmarkPlus, Plus } from "lucide-react";

type BookmarkGridProps = {
  bookmarks: Bookmark[];
  isLoading?: boolean;
  isFiltered?: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleArchive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (bookmark: Bookmark) => void;
  onAddNew?: () => void;
  onResetFilter?: () => void;
};

export function BookmarkGrid({
  bookmarks,
  isLoading = false,
  isFiltered = false,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onEdit,
  onAddNew,
  onResetFilter,
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="retro-card flex min-w-0 animate-pulse flex-col p-5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border-2"
                  style={{
                    backgroundColor: "var(--surface-muted)",
                    borderColor: "var(--border)",
                  }}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div
                    className="h-4 w-3/4 rounded"
                    style={{ backgroundColor: "var(--surface-muted)" }}
                  />
                  <div
                    className="h-3 w-1/2 rounded"
                    style={{ backgroundColor: "var(--surface-muted)" }}
                  />
                </div>
              </div>
              <div className="flex gap-1.5">
                <div
                  className="h-8 w-8 rounded-lg border"
                  style={{
                    backgroundColor: "var(--surface-muted)",
                    borderColor: "var(--border)",
                  }}
                />
                <div
                  className="h-8 w-8 rounded-lg border"
                  style={{
                    backgroundColor: "var(--surface-muted)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <div
                className="h-3 w-full rounded"
                style={{ backgroundColor: "var(--surface-muted)" }}
              />
              <div
                className="h-3 w-2/3 rounded"
                style={{ backgroundColor: "var(--surface-muted)" }}
              />
            </div>
            <div
              className="h-10 w-full rounded-md border-2"
              style={{
                backgroundColor: "var(--surface-muted)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    if (isFiltered) {
      return (
        <div
          className="retro-card rounded-2xl border-2 border-dashed px-5 py-16 text-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="mb-3 flex justify-center"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArchiveX size={48} strokeWidth={1.8} />
          </div>
          <h3 className="text-base font-bold">Tidak ada bookmark yang cocok</h3>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Coba ganti kata kunci pencarian atau pilih kategori lain.
          </p>
          {onResetFilter && (
            <button
              onClick={onResetFilter}
              className="retro-button mt-4 px-4 py-2 text-sm font-bold"
              style={{
                backgroundColor: "var(--surface-muted)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Reset Filter
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className="retro-card rounded-2xl border-2 border-dashed px-5 py-16 text-center"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="mb-4 flex justify-center"
          style={{ color: "var(--accent)" }}
        >
          <BookmarkPlus size={52} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-bold">Belum Ada Bookmark Tersimpan</h3>
        <p
          className="mx-auto mt-2 max-w-md text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          Koleksi link kamu masih kosong. Simpan tautan website, artikel, atau
          dokumentasi favoritmu dalam satu sarang!
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="retro-button mt-6 inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-2.5 text-sm font-bold"
            style={{ color: "var(--background)" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Tambah Bookmark Pertama</span>
          </button>
        )}
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
