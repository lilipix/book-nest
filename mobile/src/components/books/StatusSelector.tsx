import { Pressable, StyleSheet, Text, View } from "react-native";

import { BookStatus } from "@/gql/graphql";

import { colors, radius, spacing } from "@/styles/theme";

type Props = {
  value: BookStatus;
  onChange: (value: BookStatus) => void;
};

const OPTIONS = [
  { label: "Lu", value: BookStatus.Read },
  { label: "À lire", value: BookStatus.ToRead },
  { label: "Non lu", value: BookStatus.Unread },
];

export default function StatusSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: radius.sm,
    padding: spacing.xs,
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: colors.primary,
  },

  text: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },

  activeText: {
    color: colors.white,
    fontWeight: "600",
  },
});
