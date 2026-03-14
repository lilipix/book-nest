import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";

import { useAuth } from "../context/AuthContext";

import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import BooksScreen from "../screens/LibraryScreen";
import CreateBookScreen from "../screens/CreateBookScreen";
import EditBookScreen from "../screens/EditBookScreen";
import LibraryScreen from "../screens/LibraryScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Books" component={LibraryScreen} />
        <Stack.Screen name="CreateBook" component={AddBookScreen} />
        <Stack.Screen name="EditBook" component={EditBookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
