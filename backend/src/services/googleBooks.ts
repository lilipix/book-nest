type GoogleBooksApiResponse = {
  items?: Array<{
    volumeInfo?: {
      title?: string;
      authors?: string[];
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
  }>;
};

function normalizeGoogleImageUrl(url?: string | null) {
  if (!url) return null;
  return url.replace("http://", "https://");
}

export async function fetchBookByIsbnFromGoogle(isbn: string) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY manquante");
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
    isbn,
  )}&key=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erreur Google Books : ${res.status}`);
  }

  const data: GoogleBooksApiResponse = await res.json();

  const item = data.items?.[0];
  const volumeInfo = item?.volumeInfo;

  if (!volumeInfo) {
    return null;
  }

  return {
    isbn,
    title: volumeInfo.title ?? null,
    author: volumeInfo.authors?.[0] ?? null,
    image: normalizeGoogleImageUrl(
      volumeInfo.imageLinks?.thumbnail ??
        volumeInfo.imageLinks?.smallThumbnail ??
        null,
    ),
  };
}
