import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Filter } from "../hooks/useBooks";

type Props = {
  active?: Filter;
  onChange: (filter?: Filter) => void;
};

export default function FilterSegment({ onChange, active }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, active === undefined && styles.active]}
        onPress={() => onChange(undefined)}
      >
        <Text style={[styles.text, active === undefined && styles.activeText]}>
          Tous
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, active === Filter.ToRead && styles.active]}
        onPress={() => onChange(Filter.ToRead)}
      >
        <Text
          style={[styles.text, active === Filter.ToRead && styles.activeText]}
        >
          À lire
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, active === Filter.Read && styles.active]}
        onPress={() => onChange(Filter.Read)}
      >
        <Text
          style={[styles.text, active === Filter.Read && styles.activeText]}
        >
          Lus
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, active === Filter.Favorites && styles.active]}
        onPress={() => onChange(Filter.Favorites)}
      >
        <Text
          style={[
            styles.text,
            active === Filter.Favorites && styles.activeText,
          ]}
        >
          Favoris
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, active === Filter.Borrowed && styles.active]}
        onPress={() => onChange(Filter.Borrowed)}
      >
        <Text
          style={[styles.text, active === Filter.Borrowed && styles.activeText]}
        >
          Prêtés
        </Text>
      </Pressable>
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },

  text: {
    fontSize: 14,
    color: "#444",
  },

  active: {
    backgroundColor: "#4A6FA5",
    transform: [{ scale: 1.05 }],
  },

  activeText: {
    color: "white",
    fontWeight: "600",
  },
});
