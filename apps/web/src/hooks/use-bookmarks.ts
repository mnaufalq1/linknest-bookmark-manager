import { useEffect, useMemo, useState } from "react";
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

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Semua Bookmark");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [archivedIds, setArchivedIds] = useState<number[]>([]);

  // Mengambil bookmark dari database ketika hook pertama kali digunakan.
  useEffect(() => {
    async function loadBookmarks() {
      try {
        const response = await fetch("/api/bookmarks");
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
      }
    }

    loadBookmarks();
  }, []);

  const visibleBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(search.toLowerCase()) ||
        bookmark.category.toLowerCase().includes(search.toLowerCase());

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
  }, [bookmarks, search, activeNav, activeCategory, archivedIds]);

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
    bookmarks,
    setBookmarks,
    search,
    setSearch,
    activeNav,
    setActiveNav,
    activeCategory,
    setActiveCategory,
    archivedIds,
    setArchivedIds,
    visibleBookmarks,
    toggleFavorite,
    addBookmark,
    updateBookmark,
    toggleArchive,
    deleteBookmark,
  };
}
