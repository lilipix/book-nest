import { Alert } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export async function uploadBookCover(bookId: string, uri: string) {
  const fileName = uri.split("/").pop() || `cover_${Date.now()}.jpg`;

  const mimeType = fileName.toLowerCase().endsWith(".png")
    ? "image/png"
    : fileName.toLowerCase().endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  const formData = new FormData();

  const file = {
    uri,
    name: fileName,
    type: mimeType,
  } as const;

  formData.append("file", file as never);

  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/cover`, {
    method: "POST",
    body: formData,
  });

  //   const json = await res.json();

  //   if (!res.ok) {
  //     throw new Error(json?.error || "Erreur upload image");
  //   }

  //   return json;
  // }

  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();

  if (!res.ok) {
    Alert.alert(
      "Erreur upload",
      `Status: ${res.status}\nType: ${contentType}\nRéponse: ${rawText.slice(0, 500)}`,
    );
    throw new Error(
      `Upload failed - status ${res.status} - response: ${rawText}`,
    );
  }

  if (!contentType.includes("application/json")) {
    Alert.alert(
      "Réponse inattendue",
      `Type: ${contentType}\nRéponse: ${rawText.slice(0, 500)}`,
    );
    throw new Error(`Réponse non JSON: ${rawText}`);
  }
}
