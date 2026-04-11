import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
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

export async function optimizeImageBeforeUpload(uri: string) {
  const context = ImageManipulator.manipulate(uri);

  context.resize({ width: 800 });

  const image = await context.renderAsync();

  const result = await image.saveAsync({
    compress: 0.7,
    format: SaveFormat.JPEG,
  });

  return result;
}
