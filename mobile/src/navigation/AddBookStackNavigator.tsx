import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddBookScreen from "@/screens/AddBookScreen";
import type { AddBookStackParamList } from "./types";

const Stack = createNativeStackNavigator<AddBookStackParamList>();

export default function AddBookStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddBookHome"
        component={AddBookScreen}
        options={{ title: "Ajouter un livre" }}
      />
    </Stack.Navigator>
  );
}
