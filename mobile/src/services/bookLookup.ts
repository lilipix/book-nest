import {
  BookFromIsbnResult,
  getGoogleBooksImage,
  getOpenLibraryCoverUrl,
  normalizeImageUrl,
} from "@/utils/books";

let lastGoogleBooksCall = 0;
const MIN_DELAY_BETWEEN_CALLS = 1500;

export const fetchBookByIsbn = async (
  isbn: string,
): Promise<BookFromIsbnResult> => {
  const now = Date.now();

  if (now - lastGoogleBooksCall < MIN_DELAY_BETWEEN_CALLS) {
    throw new Error("Google Books error: too_many_local_requests");
  }

  lastGoogleBooksCall = now;
  console.log("Google Books call", isbn, new Date().toISOString());
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
  );

  if (!res.ok) {
    throw new Error(`Google Books error: ${res.status}`);
  }

  const data = await res.json();
  const volumeInfo = data.items?.[0]?.volumeInfo;

  if (!volumeInfo) {
    return {
      title: "",
      author: "",
      image: "",
      found: false,
    };
  }

  const title = volumeInfo.title ?? "";
  const author = volumeInfo.authors?.join(", ") ?? "";

  let image = getGoogleBooksImage(volumeInfo.imageLinks);

  if (image) {
    image = normalizeImageUrl(image);
  }

  if (!image) {
    const openLibraryImage = getOpenLibraryCoverUrl(isbn);

    try {
      const coverRes = await fetch(openLibraryImage, { method: "HEAD" });

      if (coverRes.ok) {
        image = openLibraryImage;
      }
    } catch (error) {
      console.error("Erreur Open Library :", error);
    }
  }

  return {
    title,
    author,
    image,
    found: true,
  };
};
