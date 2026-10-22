import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  validateCreateBookmarkInput,
  validateUpdateBookmarkInput,
  validateBookmarkId,
} from "@/lib/validators";

// Fungsi helper untuk mengambil sesi user dari request
// Mengembalikan userId atau response error 401 jika belum login
async function ambilUserId(
  request?: Request,
): Promise<{ userId: string } | { error: NextResponse }> {
  try {
    let reqHeaders: Headers;
    if (request?.headers) {
      reqHeaders = request.headers;
    } else {
      reqHeaders = await headers();
    }

    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user?.id) {
      return {
        error: NextResponse.json(
          { success: false, message: "Kamu harus login terlebih dahulu." },
          { status: 401 },
        ),
      };
    }

    return { userId: session.user.id };
  } catch (err) {
    console.error("Gagal memeriksa sesi user:", err);
    return {
      error: NextResponse.json(
        { success: false, message: "Kamu harus login terlebih dahulu." },
        { status: 401 },
      ),
    };
  }
}

// Helper untuk membaca body JSON dengan aman
async function bacaJsonBody(
  request: Request,
): Promise<{ data: Record<string, unknown> } | { error: NextResponse }> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        error: NextResponse.json(
          { success: false, message: "Format data JSON tidak valid." },
          { status: 400 },
        ),
      };
    }
    return { data: body as Record<string, unknown> };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: "Format data JSON tidak valid." },
        { status: 400 },
      ),
    };
  }
}

export async function GET(request: Request) {
  try {
    const hasil = await ambilUserId(request);

    if ("error" in hasil) return hasil.error;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: hasil.userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: bookmarks,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
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
    const hasil = await ambilUserId(request);

    if ("error" in hasil) return hasil.error;

    const parsedBody = await bacaJsonBody(request);
    if ("error" in parsedBody) return parsedBody.error;

    const validation = validateCreateBookmarkInput(parsedBody.data);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 },
      );
    }

    const { title, url, category, description, icon } = validation.data;

    // Simpan bookmark dengan userId dari sesi yang sedang aktif
    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        url,
        category,
        description,
        icon,
        userId: hasil.userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bookmark berhasil disimpan.",
        data: bookmark,
      },
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
    const hasil = await ambilUserId(request);

    if ("error" in hasil) return hasil.error;

    const parsedBody = await bacaJsonBody(request);
    if ("error" in parsedBody) return parsedBody.error;

    const idValidation = validateBookmarkId(parsedBody.data.id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, message: idValidation.error },
        { status: 400 },
      );
    }

    const id = idValidation.data;

    // Pastikan bookmark milik user yang sedang login
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id, userId: hasil.userId },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark tidak ditemukan atau kamu tidak memiliki akses.",
        },
        { status: 404 },
      );
    }

    const updateValidation = validateUpdateBookmarkInput(parsedBody.data);
    if (!updateValidation.isValid) {
      return NextResponse.json(
        { success: false, message: updateValidation.error },
        { status: 400 },
      );
    }

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: updateValidation.data,
    });

    return NextResponse.json({
      success: true,
      message: "Bookmark berhasil diperbarui.",
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
    const hasil = await ambilUserId(request);

    if ("error" in hasil) return hasil.error;

    const parsedBody = await bacaJsonBody(request);
    if ("error" in parsedBody) return parsedBody.error;

    const idValidation = validateBookmarkId(parsedBody.data.id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, message: idValidation.error },
        { status: 400 },
      );
    }

    const id = idValidation.data;

    // Pastikan bookmark milik user yang sedang login
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id, userId: hasil.userId },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark tidak ditemukan atau kamu tidak memiliki akses.",
        },
        { status: 404 },
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
