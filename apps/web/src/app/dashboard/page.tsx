"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookmarkForm } from "../../components/bookmarks/bookmark-form";
import { AppDialog } from "../../components/ui/app-dialog";
import { BookmarkGrid } from "../../components/bookmarks/bookmark-grid";
import type { Bookmark as BookmarkItem } from "../../components/bookmarks/bookmark-card";
import {
  useBookmarks,
  navigation,
  type SortOption,
} from "../../hooks/use-bookmarks";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Archive,
  ArrowUpDown,
  Bookmark,
  Heart,
  LayoutGrid,
  Plus,
  Search,
  X,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(
    null,
  );

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const {
    isLoading,
    bookmarks,
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
    visibleBookmarks,
    toggleFavorite,
    toggleArchive,
    deleteBookmark,
    addBookmark,
    updateBookmark,
  } = useBookmarks(session?.user?.id);

  const activeCount = bookmarks.filter(
    (bookmark) => !archivedIds.includes(bookmark.id),
  ).length;

  const favoriteCount = bookmarks.filter(
    (bookmark) => bookmark.favorite && !archivedIds.includes(bookmark.id),
  ).length;

  const archivedCount = archivedIds.length;

  if (isPending) {
    return (
      <main
        className="flex min-h-screen items-center justify-center p-4"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div
          className="retro-card flex flex-col items-center gap-3 p-8 text-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-lg border-2 border-[var(--retro-outline)] bg-[var(--retro-olive)] text-white shadow-[3px_3px_0_var(--retro-outline)]">
            <Bookmark size={24} strokeWidth={2.5} />
          </div>
          <p className="text-base font-bold">Memuat LinkNest...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="flex min-h-screen">
        <aside
          className="hidden w-64 shrink-0 flex-col border-r p-5 md:flex"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <Link href="/" className="mb-10 flex items-center gap-3 px-2">
            <span className="flex h-11 w-11 items-center justify-center border-2 border-[var(--retro-outline)] bg-[var(--retro-olive)] text-white shadow-[3px_3px_0_var(--retro-outline)]">
              <Bookmark size={24} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tight">LinkNest</span>
          </Link>

          <p
            className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            MENU
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const selected = activeNav === item.label;
              const count =
                item.label === "Semua Bookmark"
                  ? activeCount
                  : item.label === "Favorit"
                    ? favoriteCount
                    : archivedCount;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className="retro-button flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-bold"
                  style={{
                    backgroundColor: selected
                      ? "var(--surface-muted)"
                      : "transparent",
                    color: selected ? "var(--accent)" : "var(--foreground)",
                    borderColor: selected
                      ? "var(--retro-outline)"
                      : "transparent",
                  }}
                >
                  <span className="flex items-center justify-center">
                    {item.label === "Semua Bookmark" ? (
                      <LayoutGrid size={20} />
                    ) : item.label === "Favorit" ? (
                      <Heart size={20} />
                    ) : (
                      <Archive size={20} />
                    )}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className="retro-card mt-auto p-3"
            style={{ backgroundColor: "var(--surface-muted)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center border-2 font-black uppercase"
                style={{
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--retro-outline)",
                  color: "var(--accent-foreground)",
                }}
              >
                {session?.user?.name?.charAt(0) || "?"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">
                  {session?.user?.name || "Memuat..."}
                </p>
                <p
                  className="mt-1 truncate text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {session?.user?.email || ""}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                setAppDialogOpen(true);
              }}
              className="retro-button mt-3 flex w-full items-center justify-center gap-2 px-2 py-2 text-xs font-bold"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
              }}
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header
            className="flex min-h-20 items-center justify-between gap-4 border-b px-5 py-4 pr-20 sm:px-8 sm:pr-20"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold sm:text-2xl">
                {activeNav}
              </h1>
              <p
                className="mt-1 hidden text-sm sm:block"
                style={{ color: "var(--muted-foreground)" }}
              >
                Simpan dan temukan kembali link favoritmu.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingBookmark(null);
                setShowForm(true);
              }}
              className="retro-button shrink-0 bg-[var(--accent)] px-4 py-2.5 text-sm font-bold"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              <span className="mr-1">
                <Plus size={18} className="mr-1 inline-block align-middle" />
              </span>
              <span className="hidden sm:inline">Tambah Link</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </header>

          <div className="mx-auto max-w-7xl p-4 pb-24 sm:p-8 sm:pb-24 md:pb-8">
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total Bookmark",
                  value: activeCount,
                  icon: LayoutGrid,
                  color: "#6366f1",
                },
                {
                  label: "Favorit",
                  value: favoriteCount,
                  icon: Heart,
                  color: "#ec4899",
                },
                {
                  label: "Diarsipkan",
                  value: archivedCount,
                  icon: Archive,
                  color: "#0d9488",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="retro-card min-w-0 p-5"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-xl"
                      style={{
                        backgroundColor: `${stat.color}18`,
                        color: stat.color,
                        borderColor: "var(--retro-outline)",
                      }}
                    >
                      <stat.icon size={22} strokeWidth={2.5} />
                    </span>
                  </div>
                  <p className="text-3xl font-bold tabular-nums">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="bookmark-search" className="sr-only">
                Cari bookmark
              </label>
              <div
                className="retro-card flex items-center gap-3 border px-4"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>
                  <Search size={20} />
                </span>
                <input
                  id="bookmark-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari judul, URL, atau kategori..."
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--foreground)" }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label="Hapus pencarian"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {allCategories.map((item) => {
                const selected = activeCategory === item;

                return (
                  <button
                    key={item}
                    onClick={() => setActiveCategory(item)}
                    className="retro-button rounded-full border px-4 py-2 text-sm font-medium transition"
                    style={{
                      backgroundColor: selected
                        ? "var(--accent)"
                        : "var(--surface)",
                      color: selected
                        ? "var(--accent-foreground)"
                        : "var(--foreground)",
                      borderColor: selected ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Koleksi Link</h2>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: "var(--surface-muted)",
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {visibleBookmarks.length} Link
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="hidden text-xs font-semibold uppercase tracking-wider sm:inline"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Urutkan:
                </span>
                <div className="relative flex items-center">
                  <ArrowUpDown
                    size={14}
                    className="pointer-events-none absolute left-2.5"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="retro-input cursor-pointer rounded-md border-2 py-1.5 pl-8 pr-3 text-xs font-bold outline-none"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="a-z">Nama (A - Z)</option>
                    <option value="z-a">Nama (Z - A)</option>
                  </select>
                </div>
              </div>
            </div>

            <BookmarkGrid
              bookmarks={visibleBookmarks}
              isLoading={isLoading}
              isFiltered={Boolean(search.trim() || activeCategory !== "Semua")}
              onResetFilter={() => {
                setSearch("");
                setActiveCategory("Semua");
              }}
              onAddNew={() => {
                setEditingBookmark(null);
                setShowForm(true);
              }}
              onToggleFavorite={toggleFavorite}
              onToggleArchive={toggleArchive}
              onDelete={deleteBookmark}
              onEdit={(bookmark) => {
                setEditingBookmark(bookmark);
                setShowForm(true);
              }}
            />
          </div>

          <nav
            aria-label="Navigasi utama"
            className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-1 border-t p-2 md:hidden"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
            }}
          >
            {navigation.map((item) => {
              const selected = activeNav === item.label;

              const count =
                item.label === "Semua Bookmark"
                  ? activeCount
                  : item.label === "Favorit"
                    ? favoriteCount
                    : archivedCount;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  aria-current={selected ? "page" : undefined}
                  className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor: selected
                      ? "var(--surface-muted)"
                      : "transparent",
                    color: selected
                      ? "var(--accent)"
                      : "var(--muted-foreground)",
                  }}
                >
                  <span className="flex items-center justify-center">
                    {item.label === "Semua Bookmark" ? (
                      <LayoutGrid size={20} />
                    ) : item.label === "Favorit" ? (
                      <Heart size={20} />
                    ) : (
                      <Archive size={20} />
                    )}
                  </span>
                  <span className="w-full truncate text-center">
                    {item.label}
                  </span>
                  <span className="text-[10px] leading-none">{count}</span>
                </button>
              );
            })}
          </nav>
        </section>

        <AppDialog
          open={appDialogOpen}
          onClose={() => setAppDialogOpen(false)}
          title="Keluar"
          role="alertdialog"
          icon={
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 text-xl"
              style={{
                backgroundColor: "#B96F5220",
                borderColor: "#B96F52",
                color: "#B96F52",
              }}
            >
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
          }
          description={<>Apakah kamu yakin ingin keluar dari akun kamu?</>}
          footer={
            <>
              <button
                onClick={() => setAppDialogOpen(false)}
                className="retro-button px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: "var(--border)" }}
              >
                Batal
              </button>

              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/";
                }}
                className="retro-button px-4 py-2.5 text-sm font-bold text-white"
                style={{
                  backgroundColor: "#B96F52",
                  borderColor: "#332F28",
                }}
              >
                Ya, Keluar
              </button>
            </>
          }
        />
      </div>

      <BookmarkForm
        open={showForm}
        categories={allCategories}
        editBookmark={editingBookmark}
        onClose={() => {
          setShowForm(false);
          setEditingBookmark(null);
        }}
        onSave={addBookmark}
        onUpdate={updateBookmark}
      />
    </main>
  );
}
