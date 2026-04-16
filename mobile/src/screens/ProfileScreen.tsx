import { Button, Text, View } from "react-native";

import { useAuth } from "@/context/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View>
      <Text>{user?.email}</Text>
      <Button title="Se déconnecter" onPress={() => void signOut()} />
    </View>
  );
}
