const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export async function uploadBookCover(bookId: string, uri: string) {
  const fileName = uri.split("/").pop() || `cover_${Date.now()}.jpg`;

  const mimeType = fileName.toLowerCase().endsWith(".png")
    ? "image/png"
    : fileName.toLowerCase().endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/cover`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Erreur upload image");
  }

  return json;
}
