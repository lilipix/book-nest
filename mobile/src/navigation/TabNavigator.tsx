import AddBookScreen from "@/screens/AddBookScreen";
import LibraryScreen from "@/screens/LibraryScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bibliothèque" component={LibraryScreen} />
      <Tab.Screen name="Ajouter" component={AddBookScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
