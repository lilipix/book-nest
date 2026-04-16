import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "@/components/LoadingScreen";

import { useAuth } from "@/context/useAuth";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import ScanBookScreen from "@/screens/ScanBookScreen";

import TabNavigator from "./TabNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="ScanBook"
              component={ScanBookScreen}
              options={{ headerShown: true, title: "Scanner un livre" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true, title: "Créer un compte" }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
