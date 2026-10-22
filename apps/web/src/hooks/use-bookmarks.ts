import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Bookmark } from "../components/bookmarks/bookmark-card";

type BookmarkFromApi = Bookmark & {
  archived: boolean;
};

export const navigation = [
  { label: "Semua Bookmark" },
  { label: "Favorit" },
  { label: "Arsip" },
];

export const categories = [
  "Semua",
  "Development",
  "Design",
  "Tools",
  "Entertainment",
];

export type SortOption = "terbaru" | "terlama" | "a-z" | "z-a";

export function useBookmarks(userId?: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Semua Bookmark");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<SortOption>("terbaru");
  const [archivedIds, setArchivedIds] = useState<number[]>([]);

  const loadBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks([]);
      setArchivedIds([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/bookmarks", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil bookmark.");
      }

      const data = result.data as BookmarkFromApi[];
      setBookmarks(data);
      setArchivedIds(
        data
          .filter((bookmark) => bookmark.archived)
          .map((bookmark) => bookmark.id),
      );
    } catch (error) {
      console.error("Gagal memuat bookmark:", error);
      toast.error("Gagal memuat bookmark", {
        description: "Periksa koneksi database, lalu coba muat ulang.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Mengambil bookmark dari database ketika user login atau berganti akun
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const allCategories = useMemo(() => {
    const set = new Set(categories);
    bookmarks.forEach((b) => {
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    return Array.from(set);
  }, [bookmarks]);

  const visibleBookmarks = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = bookmarks.filter((bookmark) => {
      const matchesSearch =
        !searchLower ||
        bookmark.title.toLowerCase().includes(searchLower) ||
        bookmark.url.toLowerCase().includes(searchLower) ||
        bookmark.category.toLowerCase().includes(searchLower) ||
        (bookmark.description &&
          bookmark.description.toLowerCase().includes(searchLower));

      const matchesNavigation =
        activeNav === "Favorit"
          ? bookmark.favorite && !archivedIds.includes(bookmark.id)
          : activeNav === "Arsip"
            ? archivedIds.includes(bookmark.id)
            : !archivedIds.includes(bookmark.id);

      const matchesCategory =
        activeCategory === "Semua" || bookmark.category === activeCategory;

      return matchesSearch && matchesNavigation && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "terlama") {
        return a.id - b.id;
      }
      if (sortBy === "a-z") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "z-a") {
        return b.title.localeCompare(a.title);
      }
      // default: terbaru (id descending)
      return b.id - a.id;
    });
  }, [bookmarks, search, activeNav, activeCategory, archivedIds, sortBy]);

  async function toggleFavorite(id: number) {
    const bookmark = bookmarks.find((item) => item.id === id);

    if (!bookmark) return;

    const nextFavorite = !bookmark.favorite;

    try {
      const response = await fetch("/api/bookmarks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          favorite: nextFavorite,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui favorit.");
      }

      setBookmarks((current) =>
        current.map((item) =>
          item.id === id ? { ...item, favorite: result.data.favorite } : item,
        ),
      );

      toast.success(
        nextFavorite ? "Ditambahkan ke favorit" : "Dihapus dari favorit",
        {
          description: bookmark.title,
        },
      );
    } catch (error) {
      console.error("Gagal memperbarui favorit:", error);

      toast.error("Favorit gagal diperbarui", {
        description: "Silakan coba lagi.",
      });
    }
  }

  async function addBookmark(bookmarkData: Omit<Bookmark, "id" | "favorite">) {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookmarkData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menyimpan bookmark.");
    }

    const newBookmark = result.data as BookmarkFromApi;

    setBookmarks((current) => [newBookmark, ...current]);

    setActiveNav("Semua Bookmark");
    setActiveCategory("Semua");
    setSearch("");

    toast.success("Bookmark berhasil disimpan", {
      description: newBookmark.title,
    });
  }

  async function updateBookmark(updatedData: Bookmark) {
    const response = await fetch("/api/bookmarks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: updatedData.id,
        title: updatedData.title,
        url: updatedData.url,
        category: updatedData.category,
        description: updatedData.description,
        icon: updatedData.icon,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memperbarui bookmark.");
    }

    const updated = result.data as BookmarkFromApi;

    setBookmarks((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );

    toast.success("Bookmark berhasil diperbarui", {
      description: updated.title,
    });
  }

  async function toggleArchive(id: number) {
    const bookmark = bookmarks.find((item) => item.id === id);

    if (!bookmark) return;

    const isArchived = archivedIds.includes(id);
    const nextArchived = !isArchived;

    try {
      const response = await fetch("/api/bookmarks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          archived: nextArchived,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui arsip.");
      }

      setArchivedIds((current) =>
        nextArchived
          ? [...current, id]
          : current.filter((itemId) => itemId !== id),
      );

      toast.success(
        nextArchived
          ? "Bookmark dipindahkan ke arsip"
          : "Bookmark dikembalikan dari arsip",
        {
          description: bookmark.title,
        },
      );
    } catch (error) {
      console.error("Gagal memperbarui arsip:", error);

      toast.error("Status arsip gagal diperbarui", {
        description: "Silakan coba lagi.",
      });
    }
  }

  async function deleteBookmark(id: number) {
    const bookmark = bookmarks.find((item) => item.id === id);

    if (!bookmark) return;

    // Konfirmasi penghapusan akan ditangani oleh dialog di UI.
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus bookmark.");
      }

      setBookmarks((current) => current.filter((item) => item.id !== id));

      setArchivedIds((current) => current.filter((itemId) => itemId !== id));

      toast.success("Bookmark berhasil dihapus", {
        description: bookmark.title,
      });
    } catch (error) {
      console.error("Gagal menghapus bookmark:", error);

      toast.error("Bookmark gagal dihapus", {
        description: "Silakan coba lagi.",
      });
    }
  }

  return {
    isLoading,
    bookmarks,
    setBookmarks,
    search,
    setSearch,
    activeNav,
    setActiveNav,
    activeCategory,
    setActiveCategory,
    allCategories,
    sortBy,
    setSortBy,
    archivedIds,
    setArchivedIds,
    visibleBookmarks,
    toggleFavorite,
    addBookmark,
    updateBookmark,
    toggleArchive,
    deleteBookmark,
    refresh: loadBookmarks,
  };
}
