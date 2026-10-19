
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.error("Gagal mengambil bookmark:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data bookmark.",
      },
      { status: 500 },
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const url =
      typeof body.url === "string" ? body.url.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";
    const icon =
      typeof body.icon === "string" ? body.icon : "🔗";

    if (!title || !url || !category) {
      return NextResponse.json(
        { success: false, message: "Judul, URL, dan kategori wajib diisi." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, message: "Format URL tidak valid." },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { success: false, message: "URL harus menggunakan HTTP atau HTTPS." },
        { status: 400 },
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        url: parsedUrl.toString(),
        category,
        description: description || "Belum ada deskripsi.",
        icon,
      },
    });

    return NextResponse.json(
      { success: true, data: bookmark },
      { status: 201 },
    );
  } catch (error) {
    console.error("Gagal menyimpan bookmark:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menyimpan bookmark." },
      { status: 500 },
    );
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID bookmark tidak valid.",
        },
        { status: 400 },
      );
    }

    const data: {
      title?: string;
      url?: string;
      category?: string;
      description?: string;
      favorite?: boolean;
      archived?: boolean;
    } = {};

    if (typeof body.title === "string") {
      const cleanTitle = body.title.trim();
      if (!cleanTitle) {
        return NextResponse.json(
          { success: false, message: "Judul tidak boleh kosong." },
          { status: 400 },
        );
      }
      data.title = cleanTitle;
    }

    if (typeof body.url === "string") {
      const cleanUrl = body.url.trim();
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(cleanUrl);
      } catch {
        return NextResponse.json(
          { success: false, message: "Format URL tidak valid." },
          { status: 400 },
        );
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { success: false, message: "URL harus menggunakan HTTP atau HTTPS." },
          { status: 400 },
        );
      }

      data.url = parsedUrl.toString();
    }

    if (typeof body.category === "string") {
      const cleanCategory = body.category.trim();
      if (!cleanCategory) {
        return NextResponse.json(
          { success: false, message: "Kategori tidak boleh kosong." },
          { status: 400 },
        );
      }
      data.category = cleanCategory;
    }

    if (typeof body.description === "string") {
      data.description = body.description.trim() || "Belum ada deskripsi.";
    }

    if (typeof body.favorite === "boolean") {
      data.favorite = body.favorite;
    }

    if (typeof body.archived === "boolean") {
      data.archived = body.archived;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada perubahan yang valid.",
        },
        { status: 400 },
      );
    }

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.error("Gagal memperbarui bookmark:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui bookmark.",
      },
      { status: 500 },
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID bookmark tidak valid.",
        },
        { status: 400 },
      );
    }

    await prisma.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Bookmark berhasil dihapus.",
    });
  } catch (error) {
    console.error("Gagal menghapus bookmark:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus bookmark.",
      },
      { status: 500 },
    );
  }
}
