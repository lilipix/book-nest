import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/styles/theme";

type ScanFeedbackProps = {
  found?: boolean;
  scannedIsbn: string | null;
  onAddBook: () => void;
};

const ScanFeedback = ({ found, scannedIsbn, onAddBook }: ScanFeedbackProps) => {
  return (
    <View style={styles.scanCard}>
      <Text style={styles.scanCardText}>
        {found
          ? "Livre trouvé dans votre bibliothèque"
          : "Livre non trouvé dans votre bibliothèque"}
      </Text>

      {!found && (
        <Pressable
          style={({ pressed }) => [
            styles.addScannedButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            if (!scannedIsbn) return;
            onAddBook();
          }}
        >
          <Text style={styles.addScannedButtonText}>Ajouter ce livre</Text>
        </Pressable>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  scanCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
  },

  scanCardText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "center",
  },

  addScannedButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },

  addScannedButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.75,
  },
});
export default ScanFeedback;
