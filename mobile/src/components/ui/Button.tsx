import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ReactNode } from "react";

import { colors, radius } from "@/styles/theme";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  leftIcon?: ReactNode;
};

export default function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  leftIcon,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? colors.primary : colors.white}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              variant === "primary" && styles.primaryText,
              variant === "secondary" && styles.secondaryText,
              variant === "danger" && styles.dangerText,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    // minHeight: 54,
    minHeight: 48,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    // paddingVertical: 14,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 8,
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  danger: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.borderDangerLight,
  },

  disabled: {
    opacity: 0.55,
  },

  pressed: {
    opacity: 0.9,
  },

  text: {
    fontSize: 16,
    fontWeight: "700",
  },

  primaryText: {
    color: colors.white,
  },

  secondaryText: {
    color: colors.primary,
  },

  dangerText: {
    color: colors.danger,
  },
});
