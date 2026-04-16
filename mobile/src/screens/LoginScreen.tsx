import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/useAuth";
import { colors } from "@/styles/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        "Connexion impossible",
        error instanceof Error ? error.message : "Erreur inconnue",
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right"]}
    >
      <View>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Se connecter" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
}
