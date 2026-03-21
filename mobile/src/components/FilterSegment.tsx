import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Filter } from "../hooks/useBooks";

type Props = {
  active?: Filter;
  onChange: (filter?: Filter) => void;
};

export default function FilterSegment({ onChange, active }: Props) {
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
    borderRadius: 18,
  },

  text: {
    fontSize: 14,
  },

  inactive: {
    backgroundColor: "transparent",
  },

  inactiveText: {
    color: "#374151",
    fontWeight: "500",
  },

  active: {
    backgroundColor: "#0F766E",
    transform: [{ scale: 1.05 }],
  },

  activeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
