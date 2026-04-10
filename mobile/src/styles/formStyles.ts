import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "./theme";

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },

  header: {
    marginBottom: spacing.xl,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    fontSize: 15,
    color: colors.text,
  },

  inputError: {
    borderColor: colors.danger,
  },

  error: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 13,
  },

  statusContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },

  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeStatusButton: {
    backgroundColor: colors.primary,
  },

  statusText: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },

  activeStatusText: {
    color: colors.white,
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },

  switchHint: {
    fontSize: 13,
    color: colors.muted,
    maxWidth: 220,
  },
});
