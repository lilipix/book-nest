import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getAuthToken } from "@/lib/authStorage";

import { AuthProvider } from "./src/context/AuthProvider";
import RootNavigator from "./src/navigation/RootNavigator";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const httpLink = new HttpLink({
  uri: API_URL,
});

const authLink = new SetContextLink(async (prevContext) => {
  const token = await getAuthToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
