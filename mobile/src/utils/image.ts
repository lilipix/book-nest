const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export const getBookImageUri = (image?: string | null) => {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("file://") ||
    image.startsWith("content://")
  ) {
    return image;
  }

  return `${API_BASE_URL}${image}`;
};

export const isLocalImage = (uri?: string | null) => {
  if (!uri) return false;
  return uri.startsWith("file://") || uri.startsWith("content://");
};
