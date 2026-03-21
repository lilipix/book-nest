import AddBookScreen from "@/screens/AddBookScreen";
import LibraryScreen from "@/screens/LibraryScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LibraryStackNavigator from "./LibraryStackNavigator";
import AddBookStackNavigator from "./AddBookStackNavigator";

export type MainTabParamList = {
  Bibliothèque: { scannedIsbn?: string } | undefined;
  "Ajouter un livre": { isbn?: string } | undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Bibliothèque") {
            iconName = focused ? "library" : "library-outline";
          } else if (route.name === "Ajouter un livre") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Bibliothèque" component={LibraryStackNavigator} />
      <Tab.Screen name="Ajouter un livre" component={AddBookStackNavigator} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
