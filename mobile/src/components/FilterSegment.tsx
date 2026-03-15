import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Filter } from "../hooks/useBooks";

type Props = {
  onChange: (filter?: Filter) => void;
};

export default function FilterSegment({ onChange }: Props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => onChange(undefined)}>
        <Text>Tous</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => onChange(Filter.ToRead)}>
        <Text>À lire</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => onChange(Filter.Read)}>
        <Text>Lus</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => onChange(Filter.Favorites)}
      >
        <Text>Favoris</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => onChange(Filter.Borrowed)}
      >
        <Text>Prêtés</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
  },
});
