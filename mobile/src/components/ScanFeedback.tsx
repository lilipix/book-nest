import { Pressable, StyleSheet, Text, View } from "react-native";

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
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0F766E",
    backgroundColor: "#FFFFFF",
  },

  addScannedButtonText: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.75,
  },
});
export default ScanFeedback;
