import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

type Props = {
  onSearch: (text: string) => void;
  onScanPress: () => void;
};

export default function SearchBar({ onSearch, onScanPress }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
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
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
  },

  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
  },
});
