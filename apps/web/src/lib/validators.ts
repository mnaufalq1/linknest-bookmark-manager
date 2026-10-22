export const MAX_TITLE_LENGTH = 200;
export const MAX_URL_LENGTH = 2048;
export const MAX_CATEGORY_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_ICON_LENGTH = 10;

export interface ValidationSuccess<T> {
  isValid: true;
  data: T;
}

export interface ValidationError {
  isValid: false;
  error: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

export interface CreateBookmarkPayload {
  title: string;
  url: string;
  category: string;
  description: string;
  icon: string;
}

export interface UpdateBookmarkPayload {
  title?: string;
  url?: string;
  category?: string;
  description?: string;
  icon?: string;
  favorite?: boolean;
  archived?: boolean;
}

/**
 * Memvalidasi apakah URL memiliki sintaks yang benar dan menggunakan protokol HTTP atau HTTPS
 */
export function validateUrl(url: string): ValidationResult<URL> {
  if (typeof url !== "string" || !url.trim()) {
    return { isValid: false, error: "URL tidak boleh kosong." };
  }

  const cleanUrl = url.trim();

  if (cleanUrl.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL tidak boleh melebihi ${MAX_URL_LENGTH} karakter.`,
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(cleanUrl);
  } catch {
    return { isValid: false, error: "Format URL tidak valid." };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return {
      isValid: false,
      error: "URL harus menggunakan HTTP atau HTTPS.",
    };
  }

  if (!parsedUrl.hostname) {
    return { isValid: false, error: "URL harus memiliki hostname yang valid." };
  }

  return { isValid: true, data: parsedUrl };
}

/**
 * Memvalidasi input saat membuat bookmark baru
 */
export function validateCreateBookmarkInput(
  body: Record<string, unknown>,
): ValidationResult<CreateBookmarkPayload> {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const icon =
    typeof body.icon === "string" && body.icon.trim()
      ? body.icon.trim().slice(0, MAX_ICON_LENGTH)
      : "🔗";

  if (!title || !rawUrl || !category) {
    return {
      isValid: false,
      error: "Judul, URL, dan kategori wajib diisi.",
    };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Judul tidak boleh melebihi ${MAX_TITLE_LENGTH} karakter.`,
    };
  }

  if (category.length > MAX_CATEGORY_LENGTH) {
    return {
      isValid: false,
      error: `Kategori tidak boleh melebihi ${MAX_CATEGORY_LENGTH} karakter.`,
    };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `Deskripsi tidak boleh melebihi ${MAX_DESCRIPTION_LENGTH} karakter.`,
    };
  }

  const urlValidation = validateUrl(rawUrl);
  if (!urlValidation.isValid) {
    return { isValid: false, error: urlValidation.error };
  }

  return {
    isValid: true,
    data: {
      title,
      url: urlValidation.data.toString(),
      category,
      description: description || "Belum ada deskripsi.",
      icon,
    },
  };
}

/**
 * Memvalidasi input saat memperbarui bookmark
 */
export function validateUpdateBookmarkInput(
  body: Record<string, unknown>,
): ValidationResult<UpdateBookmarkPayload> {
  const data: UpdateBookmarkPayload = {};

  if (typeof body.title === "string") {
    const cleanTitle = body.title.trim();
    if (!cleanTitle) {
      return { isValid: false, error: "Judul tidak boleh kosong." };
    }
    if (cleanTitle.length > MAX_TITLE_LENGTH) {
      return {
        isValid: false,
        error: `Judul tidak boleh melebihi ${MAX_TITLE_LENGTH} karakter.`,
      };
    }
    data.title = cleanTitle;
  }

  if (typeof body.url === "string") {
    const urlValidation = validateUrl(body.url);
    if (!urlValidation.isValid) {
      return { isValid: false, error: urlValidation.error };
    }
    data.url = urlValidation.data.toString();
  }

  if (typeof body.category === "string") {
    const cleanCategory = body.category.trim();
    if (!cleanCategory) {
      return { isValid: false, error: "Kategori tidak boleh kosong." };
    }
    if (cleanCategory.length > MAX_CATEGORY_LENGTH) {
      return {
        isValid: false,
        error: `Kategori tidak boleh melebihi ${MAX_CATEGORY_LENGTH} karakter.`,
      };
    }
    data.category = cleanCategory;
  }

  if (typeof body.description === "string") {
    const cleanDesc = body.description.trim();
    if (cleanDesc.length > MAX_DESCRIPTION_LENGTH) {
      return {
        isValid: false,
        error: `Deskripsi tidak boleh melebihi ${MAX_DESCRIPTION_LENGTH} karakter.`,
      };
    }
    data.description = cleanDesc || "Belum ada deskripsi.";
  }

  if (typeof body.icon === "string" && body.icon.trim()) {
    data.icon = body.icon.trim().slice(0, MAX_ICON_LENGTH);
  }

  if (typeof body.favorite === "boolean") {
    data.favorite = body.favorite;
  }

  if (typeof body.archived === "boolean") {
    data.archived = body.archived;
  }

  if (Object.keys(data).length === 0) {
    return {
      isValid: false,
      error: "Tidak ada perubahan yang valid.",
    };
  }

  return { isValid: true, data };
}

/**
 * Memvalidasi ID integer positif
 */
export function validateBookmarkId(rawId: unknown): ValidationResult<number> {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return { isValid: false, error: "ID bookmark tidak valid." };
  }
  return { isValid: true, data: id };
}
