import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { radius, spacing } from "@/styles/theme";

type SearchBarProps = {
  onSearch: (text: string) => void;
  onScanPress: () => void;
};

export default function SearchBar({ onSearch, onScanPress }: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#666" />

      <TextInput
        placeholder="Rechercher un livre ou un auteur"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => setValue("")}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onScanPress}>
        <Ionicons name="barcode-outline" size={22} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: radius.sm,
  },

  input: {
    flex: 1,
    marginHorizontal: spacing.sm,
    fontSize: spacing.lg,
  },
});
