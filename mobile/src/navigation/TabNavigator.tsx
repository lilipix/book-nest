import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddBookStackNavigator from "./AddBookStackNavigator";
import LibraryStackNavigator from "./LibraryStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
