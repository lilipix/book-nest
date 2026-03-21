import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddBookScreen from "@/screens/AddBookScreen";
import type { AjouterLivreStackParamList } from "./types";

const Stack = createNativeStackNavigator<AjouterLivreStackParamList>();

export default function AjouterLivreStackNavigator() {
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
