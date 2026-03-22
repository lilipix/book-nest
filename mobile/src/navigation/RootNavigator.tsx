import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import ScanBookScreen from "@/screens/ScanBookScreen";
import { MainTabParamList } from "./types";

export type RootStackParamList = {
  MainTabs:
    | {
        screen?: keyof MainTabParamList;
        params?: object;
      }
    | undefined;
  ScanBook: { mode: "search" | "add" };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScanBook"
          component={ScanBookScreen}
          options={{ title: "Scanner un livre" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
