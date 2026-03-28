import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBookImageUri } from "@/utils/image";

type Props = {
  value?: string | null;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
  label?: string;
  mode?: "create" | "edit";
};

export default function BookCoverField({
  value,
  onTakePhoto,
  onPickImage,
  onRemoveImage,
  label = "Couverture",
  mode = "create",
}: Props) {
  const imageUri = getBookImageUri(value);
  const hasImage = !!imageUri;

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      {hasImage ? (
        <Image source={{ uri: imageUri }} style={styles.coverPreview} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name="image-outline" size={32} color="#94A3B8" />
          <Text style={styles.coverPlaceholderText}>Aucune couverture</Text>
        </View>
      )}

      {mode === "create" && !hasImage && (
        <Text style={styles.helperText}>
          Ajouter une couverture en prenant une photo ou depuis la galerie.
        </Text>
      )}

      {mode === "edit" && hasImage && (
        <Text style={styles.helperText}>
          Vous pouvez remplacer la couverture actuelle.
        </Text>
      )}

      {mode === "edit" && !hasImage && (
        <Text style={styles.helperText}>
          Ajoutez une couverture en prenant une photo ou depuis la galerie.
        </Text>
      )}

      <View style={styles.imageActions}>
        <Pressable style={styles.imageActionButton} onPress={onTakePhoto}>
          <Ionicons name="camera-outline" size={20} color="#0F766E" />
          <Text style={styles.imageActionText}>
            {hasImage ? "Remplacer par photo" : "Prendre une photo"}
          </Text>
        </Pressable>

        <Pressable style={styles.imageActionButton} onPress={onPickImage}>
          <Ionicons name="images-outline" size={20} color="#0F766E" />
          <Text style={styles.imageActionText}>
            {hasImage ? "Remplacer" : "Choisir"}
          </Text>
        </Pressable>
      </View>

      {!!value && (
        <Pressable style={styles.removeImageButton} onPress={onRemoveImage}>
          <Text style={styles.removeImageText}>Retirer l’image</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  coverPreview: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    resizeMode: "contain",
    backgroundColor: "#E2E8F0",
  },
  coverPlaceholder: {
    height: 220,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  coverPlaceholderText: {
    color: "#64748B",
    fontSize: 14,
  },
  helperText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 10,
  },
  imageActions: {
    flexDirection: "row",
    gap: 10,
  },
  imageActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  imageActionText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 14,
  },
  removeImageButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginTop: 8,
  },
  removeImageText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
