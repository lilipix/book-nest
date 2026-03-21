import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LibraryScreen from "@/screens/LibraryScreen";
import BookDetailsScreen from "@/screens/BookDetailsScreen";
import { LibraryStackParamList } from "./types";

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export default function LibraryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LibraryHome"
        component={LibraryScreen}
        options={{ title: "Bibliothèque" }}
      />
      <Stack.Screen
        name="BookDetails"
        component={BookDetailsScreen}
        options={{ title: "Détail du livre" }}
      />
    </Stack.Navigator>
  );
}
