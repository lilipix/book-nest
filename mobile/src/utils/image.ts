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

  return `http://192.168.1.57:8080${image}`;
};

export const isLocalImage = (uri?: string | null) => {
  if (!uri) return false;
  return uri.startsWith("file://") || uri.startsWith("content://");
};
