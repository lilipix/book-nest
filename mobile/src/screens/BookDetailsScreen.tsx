import { DELETE_BOOK } from "@/api/DeleteBook";
import { BookStatus } from "@/gql/graphql";
import { useBook } from "@/hooks/useBook";
import { LibraryStackParamList } from "@/navigation/types";
import { formatDateFr, getBookColor } from "@/utils";
import { useMutation } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { de, id } from "zod/v4/locales";

type BookDetailsRouteProp = RouteProp<LibraryStackParamList, "BookDetails">;
type BookDetailNavigationProp = NativeStackNavigationProp<
  LibraryStackParamList,
  "BookDetails"
>;

function getStatusLabel(status?: BookStatus | null) {
  switch (status) {
    case BookStatus.Read:
      return "Lu";
    case BookStatus.Unread:
      return "Non lu";
    case BookStatus.ToRead:
      return "À lire";
    default:
      return "Non défini";
  }
}
const BookDetailsScreen = () => {
  const route = useRoute<BookDetailsRouteProp>();
  const navigation = useNavigation<BookDetailNavigationProp>();
  const { bookId } = route.params;
  const { book, loading, error, refetch } = useBook(String(bookId));
  const [deleteBook, { loading: deleting }] = useMutation(DELETE_BOOK);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const backgroundColor = useMemo(() => {
    return getBookColor(book?.title ?? "Livre");
  }, [book?.title]);
  const handleEdit = () => {
    navigation.navigate("EditBook", { bookId });
  };
  const handleDelete = () => {
    if (deleting) return;
    Alert.alert(
      "Supprimer le livre",
      "Etes-vous sûr de vouloir supprimer ce livre de la bibliothèque ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook({ variables: { id: String(bookId) } });
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert("Erreur", "Impossible de supprimer le livre.");
            }
          },
        },
      ],
    );
  };

  if (loading && !book) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Impossible de charger ce livre.</Text>
      </View>
    );
  }
  const isFavorite = !!book.isFavorite;
  const isBorrowed = !!book.isBorrowed;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topSection}>
        {book.image ? (
          <Image source={{ uri: book.image }} style={styles.cover} />
        ) : (
          <View style={[styles.placeholderCover, { backgroundColor }]}>
            <Text style={styles.placeholderLetter}>
              {book.title?.charAt(0)?.toUpperCase() || "L"}
            </Text>
          </View>
        )}

        <View style={styles.mainInfos}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.badgesRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {getStatusLabel(book.status)}
              </Text>
            </View>

            {isFavorite && (
              <View style={styles.favoriteBadge}>
                <Ionicons name="heart" size={14} color="#B91C1C" />
                <Text style={styles.favoriteBadgeText}>Favori</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Statut</Text>
          <Text style={styles.infoValue}>{getStatusLabel(book.status)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Favori</Text>
          <Text style={styles.infoValue}>{isFavorite ? "Oui" : "Non"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prêté</Text>
          <Text style={styles.infoValue}>{isBorrowed ? "Oui" : "Non"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prêt</Text>

        {!isBorrowed ? (
          <Text style={styles.emptyText}>
            Ce livre n’est pas prêté actuellement.
          </Text>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prêté à</Text>
              <Text style={styles.infoValue}>
                {book.borrowedBy || "Non renseigné"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date de prêt</Text>
              <Text style={styles.infoValue}>
                {formatDateFr(book.borrowedAt) || "Non renseignée"}
              </Text>
            </View>

            {book.returnedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date de retour</Text>
                <Text style={styles.infoValue}>{book.returnedAt}</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleEdit}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text style={styles.primaryButtonText}>Modifier</Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="trash-outline" size={18} color="#B91C1C" />
          <Text style={styles.secondaryButtonText}>
            {deleting ? "Suppression..." : "Supprimer"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 16,
  },
  topSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  placeholderCover: {
    width: 120,
    height: 180,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderLetter: {
    fontSize: 42,
    fontWeight: "700",
    color: "white",
  },
  mainInfos: {
    flex: 1,
    gap: 8,
    paddingTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  author: {
    fontSize: 16,
    color: "#475569",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  statusBadge: {
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    color: "#115E59",
    fontSize: 13,
    fontWeight: "600",
  },
  favoriteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  favoriteBadgeText: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  infoLabel: {
    fontSize: 15,
    color: "#64748B",
  },
  infoValue: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 15,
  },
  actions: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#FECDD3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#B91C1C",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});

export default BookDetailsScreen;
