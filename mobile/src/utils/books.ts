export const getGoogleBooksImage = (imageLinks?: {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}) => {
  return (
    imageLinks?.large ||
    imageLinks?.medium ||
    imageLinks?.small ||
    imageLinks?.thumbnail ||
    imageLinks?.smallThumbnail ||
    ""
  );
};

export const getOpenLibraryCoverUrl = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

export const normalizeImageUrl = (url: string) =>
  url.replace("http://", "https://");

export type BookFromIsbnResult = {
  title: string;
  author: string;
  image: string;
  found: boolean;
};
