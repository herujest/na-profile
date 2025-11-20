/**
 * Upload a File to the backend API route which handles R2 upload server-side.
 * Returns { key, publicUrl } on success.
 *
 * Throws Error on failure (network or server error).
 */
export async function uploadImage(
  file: File,
  slug?: string
): Promise<{ key: string; publicUrl: string | null }> {
  if (!file) throw new Error("No file provided");

  const UPLOAD_API = "/api/upload";

  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  formData.append("file", file);
  if (slug) {
    formData.append("slug", slug);
  }

  // Upload via backend API (no CORS issues)
  const res = await fetch(UPLOAD_API, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorMessage = "Failed to upload file";
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.error || errorJson.details || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const result = await res.json();
  const { key, publicUrl } = result;

  if (!key || !publicUrl) {
    throw new Error("Backend did not return key/publicUrl");
  }

  return { key, publicUrl };
}

/**
 * Delete an uploaded object by its key using backend API.
 * Returns true if deletion succeeded (HTTP 200-299), false otherwise.
 * Throws Error if network or server returns non-ok with message.
 */
export async function deleteImage(key: string): Promise<boolean> {
  if (!key) throw new Error("Missing key");
  const DELETE_API = "/api/upload-delete";

  const url = `${DELETE_API}?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to delete image");
  }
  return true;
}

