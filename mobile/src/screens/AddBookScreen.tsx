import { View, Button } from "react-native";

export default function AddBookScreen({ navigation }: any) {
  return (
    <View>
      <Button title="Scan ISBN" onPress={() => navigation.navigate("Scan")} />

      <Button
        title="Add manually"
        onPress={() => navigation.navigate("CreateBook")}
      />
    </View>
  );
}
