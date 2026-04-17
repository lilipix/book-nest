import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";

import { colors, spacing } from "@/styles/theme";

export default function AddFamilyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.description}>
            Partagez votre bibliothèque pour que chacun puisse suivre ses
            lectures et favoris.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text>
              <Ionicons name="people" size={24} color={colors.primary} />
            </Text>
            <Text style={styles.sectionTitle}>Créer une famille</Text>
          </View>

          <Text style={styles.cardText}>
            Démarrez une nouvelle bibliothèque familiale et invitez
            d&apos;autres membres à vous rejoindre.
          </Text>

          <Button label="Créer une famille" onPress={() => {}} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text>
              <Ionicons name="key" size={24} color={colors.primary} />
            </Text>
            <Text style={styles.sectionTitle}>Rejoindre une famille</Text>
          </View>

          <Text style={styles.cardText}>
            Rejoignez une famille existante avec un code ou une invitation.
          </Text>

          <Button
            variant="secondary"
            label="Rejoindre une famille"
            disabled
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.xxl,
  },
  intro: {
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
