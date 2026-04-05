import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BookDetailsScreen from "@/screens/BookDetailsScreen";
import EditBookScreen from "@/screens/EditBookScreen";
import LibraryScreen from "@/screens/LibraryScreen";

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
      <Stack.Screen
        name="EditBook"
        component={EditBookScreen}
        options={{ title: "Modifier le livre" }}
      />
    </Stack.Navigator>
  );
}
