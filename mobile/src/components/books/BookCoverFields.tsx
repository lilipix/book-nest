import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getBookImageUri } from "@/utils/image";

import { colors, radius, spacing } from "@/styles/theme";

import Button from "../ui/Button";

type BookCoverFieldProps = {
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
}: BookCoverFieldProps) {
  const imageUri = getBookImageUri(value);
  const hasImage = !!imageUri;

  return (
    <View style={styles.fieldGroup}>
      {mode === "create" && <Text style={styles.label}>{label}</Text>}

      {hasImage ? (
        <Image source={{ uri: imageUri }} style={styles.coverPreview} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name="image-outline" size={32} color={colors.muted} />
          <Text style={styles.coverPlaceholderText}>Aucune couverture</Text>
        </View>
      )}

      {mode === "create" && !hasImage && (
        <Text style={styles.helperText}>
          Ajoutez une couverture en prenant une photo ou depuis la galerie.
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
          <Ionicons name="camera-outline" size={20} color={colors.primary} />
          <Text style={styles.imageActionText}>
            {hasImage ? "Changer la photo" : "Prendre une photo"}
          </Text>
        </Pressable>

        <Pressable style={styles.imageActionButton} onPress={onPickImage}>
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={styles.imageActionText}>
            {hasImage ? "Remplacer" : "Choisir"}
          </Text>
        </Pressable>
      </View>

      {!!value && (
        <Button
          label="Retirer l'image"
          onPress={onRemoveImage}
          variant="danger"
        />
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
    color: colors.textSecondary,
    marginBottom: 6,
  },
  coverPreview: {
    width: "100%",
    height: 220,
    borderRadius: radius.md,
    resizeMode: "contain",
    backgroundColor: colors.borderSoft,
  },
  coverPlaceholder: {
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderStyle: "dashed",
  },
  coverPlaceholderText: {
    color: colors.muted,
    fontSize: 14,
  },
  helperText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm,
    marginBottom: 10,
  },
  imageActions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: spacing.md,
  },
  imageActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primaryLight,
  },
  imageActionText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  removeImageButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  removeImageText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
