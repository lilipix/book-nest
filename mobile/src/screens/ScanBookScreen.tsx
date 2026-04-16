import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Vibration } from "react-native";

import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { colors, spacing } from "@/styles/theme";

type ScanBookParamList = {
  ScanBook: { mode: "search" | "add" };
};

type ScanBookScreenRouteProp = RouteProp<ScanBookParamList, "ScanBook">;

function isValidISBN13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  if (!isbn.startsWith("978") && !isbn.startsWith("979")) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(isbn[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(isbn[12]);
}

export default function ScanBookScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<ScanBookScreenRouteProp>();
  const { mode } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isbn, setIsbn] = useState<string | null>(null);
  const [message, setMessage] = useState("Scanner un code ISBN");

  const handleScan = (isbn: string) => {
    if (mode === "search") {
      navigation.navigate("MainTabs", {
        screen: "Bibliothèque",
        params: {
          screen: "LibraryHome",
          params: { scannedIsbn: isbn },
        },
      });
      return;
    }
    if (mode === "add") {
      navigation.navigate("MainTabs", {
        screen: "Ajouter un livre",
        params: {
          screen: "AddBookHome",
          params: { isbn },
        },
      });
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Autorisation caméra requise</Text>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    if (isValidISBN13(data)) {
      setScanned(true);
      setIsbn(data);
      setMessage("ISBN valide détecté");
      Vibration.vibrate(100);
      setTimeout(() => {
        handleScan(data);
      }, 500);
    } else {
      setIsbn(null);
      setMessage(`Code détecté mais ISBN invalide : ${data}`);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>{message}</Text>
        {isbn && <Text style={styles.isbn}>{isbn}</Text>}
        <Button
          title="Scanner un autre livre"
          onPress={() => {
            setScanned(false);
            setIsbn(null);
            setMessage("Scanner un code ISBN");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: spacing.lg,
    borderRadius: spacing.md,
    gap: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
  },
  isbn: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});
