import { useCallback, useMemo } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMutation } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { DELETE_BOOK } from "@/api/DeleteBook";
import { BookStatus } from "@/gql/graphql";

import { LibraryStackParamList } from "@/navigation/types";

import { useBook } from "@/hooks/useBook";

import { formatDateFr } from "@/utils/dates";
import { getBookImageUri } from "@/utils/image";
import { getBookColor } from "@/utils/style";

import { colors } from "@/styles/theme";
import Button from "@/ui/Button";

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

  const imageUri = getBookImageUri(book?.image);
  const isFavorite = !!book?.isFavorite;
  const isBorrowed = !!book?.isBorrowed;

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F5F7FA" }}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topSection}>
          {imageUri ? (
            <Image
              key={imageUri}
              source={{ uri: imageUri }}
              style={styles.cover}
            />
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
                  <Ionicons name="heart" size={14} color={colors.favorite} />
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
          <Button
            label="Modifier"
            onPress={handleEdit}
            loading={loading}
            leftIcon={
              <Ionicons name="create-outline" size={20} color={colors.white} />
            }
          />

          <Button
            label="Supprimer"
            onPress={handleDelete}
            variant="danger"
            leftIcon={
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            }
            loading={deleting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: colors.error,
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
    backgroundColor: colors.primaryMedium,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    color: colors.primary,
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
    color: colors.favorite,
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
});

export default BookDetailsScreen;
