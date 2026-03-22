import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookStatus } from "@/gql/graphql";
import { useBook } from "@/hooks/useBook";
import { LibraryStackParamList } from "@/navigation/types";
import { formatDateFr } from "@/utils";
// import { useUpdateBook } from "@/hooks/useUpdateBook";

type EditBookRouteProp = RouteProp<LibraryStackParamList, "EditBook">;
type EditBookNavigationProp = NativeStackNavigationProp<
  LibraryStackParamList,
  "EditBook"
>;

export default function EditBookScreen() {
  const route = useRoute<EditBookRouteProp>();
  const navigation = useNavigation<EditBookNavigationProp>();
  const { bookId } = route.params;

  const { book, loading, error } = useBook(String(bookId));
  // const { updateBook, loading: updating } = useUpdateBook();

  const [status, setStatus] = useState<BookStatus>(BookStatus.ToRead);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [borrowedBy, setBorrowedBy] = useState("");
  const [borrowedAt, setBorrowedAt] = useState("");
  const [returnedAt, setReturnedAt] = useState("");

  useEffect(() => {
    if (!book) return;

    setStatus(book.status ?? BookStatus.ToRead);
    setIsFavorite(!!book.isFavorite);
    setIsBorrowed(!!book.isBorrowed);
    setBorrowedBy(book.borrowedBy ?? "");
    setBorrowedAt(book.borrowedAt ?? "");
    setReturnedAt(book.returnedAt ?? "");
  }, [book]);

  const handleSave = async () => {
    try {
      const payload = {
        status,
        isFavorite,
        isBorrowed,
        borrowedBy: isBorrowed ? borrowedBy : "",
        borrowedAt: isBorrowed ? borrowedAt : "",
        returnedAt: isBorrowed ? returnedAt : "",
      };

      console.log("Payload update", payload);

      // await updateBook({
      //   variables: {
      //     id: String(bookId),
      //     data: payload,
      //   },
      // });

      Alert.alert("Succès", "Livre mis à jour.");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de modifier le livre.");
    }
  };

  if (loading && !book) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.center}>
        <Text>Impossible de charger ce livre.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statut</Text>

        <View style={styles.statusList}>
          <Pressable
            style={[
              styles.statusButton,
              status === BookStatus.Unread && styles.statusButtonActive,
            ]}
            onPress={() => setStatus(BookStatus.Unread)}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === BookStatus.Unread && styles.statusButtonTextActive,
              ]}
            >
              Non lu
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusButton,
              status === BookStatus.ToRead && styles.statusButtonActive,
            ]}
            onPress={() => setStatus(BookStatus.ToRead)}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === BookStatus.ToRead && styles.statusButtonTextActive,
              ]}
            >
              À lire
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusButton,
              status === BookStatus.Read && styles.statusButtonActive,
            ]}
            onPress={() => setStatus(BookStatus.Read)}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === BookStatus.Read && styles.statusButtonTextActive,
              ]}
            >
              Lu
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Favori</Text>
          <Switch value={isFavorite} onValueChange={setIsFavorite} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Prêté</Text>
          <Switch
            value={isBorrowed}
            onValueChange={(value) => {
              setIsBorrowed(value);
              if (!value) {
                setBorrowedBy("");
                setBorrowedAt("");
                setReturnedAt("");
              }
            }}
          />
        </View>
      </View>

      {isBorrowed && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de prêt</Text>

          <Text style={styles.inputLabel}>Prêté à</Text>
          <TextInput
            value={borrowedBy}
            onChangeText={setBorrowedBy}
            placeholder="Nom de la personne"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Date de prêt</Text>
          <TextInput
            value={formatDateFr(borrowedAt)}
            onChangeText={setBorrowedAt}
            placeholder="2026-03-22"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Date de retour</Text>
          <TextInput
            value={returnedAt}
            onChangeText={setReturnedAt}
            placeholder="Laisser vide si non rendu"
            style={styles.input}
          />
        </View>
      )}

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusList: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },
  statusButtonActive: {
    backgroundColor: "#0F766E",
  },
  statusButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  statusButtonTextActive: {
    color: "white",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#0F172A",
  },
  inputLabel: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
