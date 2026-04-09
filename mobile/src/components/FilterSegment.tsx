import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Filter } from "@/types";

import { colors, radius } from "@/styles/theme";

type FilterSegmentProps = {
  active?: Filter;
  onChange: (filter?: Filter) => void;
};

export default function FilterSegment({
  onChange,
  active,
}: FilterSegmentProps) {
  const renderSegment = (label: string, value: Filter | undefined) => {
    const isActive = active === value;

    return (
      <Pressable
        style={[styles.button, isActive ? styles.active : styles.inactive]}
        onPress={() => onChange(value)}
      >
        <Text
          style={[
            styles.text,
            isActive ? styles.activeText : styles.inactiveText,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {renderSegment("Tous", undefined)}
      {renderSegment("À lire", Filter.ToRead)}
      {renderSegment("Lus", Filter.Read)}
      {renderSegment("Favoris", Filter.Favorites)}
      {renderSegment("Prêtés", Filter.Borrowed)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginVertical: 8,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
  },

  text: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  inactive: {
    backgroundColor: "transparent",
  },

  inactiveText: {
    color: colors.textSecondary,
    fontWeight: "500",
  },

  active: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },

  activeText: {
    color: colors.white,
    fontWeight: "600",
  },
});
