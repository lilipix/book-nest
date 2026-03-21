import { useNavigation, useRoute } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Vibration } from "react-native";
import { set } from "zod";

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

export default function Isbn() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isbn, setIsbn] = useState<string | null>(null);
  const [message, setMessage] = useState("Scanner un code ISBN");
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mode } = route.params;

  const handleScan = (isbn: string) => {
    if (mode === "search") {
      navigation.navigate("Main", {
        screen: "Bibliothèque",
        params: { scannedIsbn: isbn },
      });
      return;
    }
    if (mode === "add") {
      navigation.navigate("Main", {
        screen: "Ajouter un livre",
        params: { isbn },
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
    padding: 24,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  isbn: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});
