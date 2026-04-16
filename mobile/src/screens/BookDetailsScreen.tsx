import { useCallback, useMemo } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

import { MUTATION_DELETE_BOOK } from "@/api/DeleteBook";
import { BookStatus } from "@/gql/graphql";

import { LibraryStackParamList } from "@/navigation/types";

import { useBook } from "@/hooks/useBook";

import Button from "@/components/ui/Button";

import { formatDateFr } from "@/utils/dates";
import { getBookImageUri } from "@/utils/image";
import { getBookColor } from "@/utils/style";

import { bookShadow, colors, radius, spacing } from "@/styles/theme";

type BookDetailsRouteProp = RouteProp<LibraryStackParamList, "BookDetails">;
type BookDetailNavigationProp = NativeStackNavigationProp<
  LibraryStackParamList,
  "BookDetails"
>;

function getStatusBadge(status?: BookStatus | null) {
  switch (status) {
    case BookStatus.Read:
      return { label: "Lu", icon: "checkmark-done-outline" as const };
    case BookStatus.Unread:
      return { label: "Non lu", icon: "close-outline" as const };
    case BookStatus.ToRead:
      return { label: "À lire", icon: "book-outline" as const };
    default:
      return { label: "Non défini", icon: "help-circle-outline" as const };
  }
}
const BookDetailsScreen = () => {
  const route = useRoute<BookDetailsRouteProp>();
  const navigation = useNavigation<BookDetailNavigationProp>();
  const { bookId } = route.params;

  const { book, loading, error, refetch } = useBook(String(bookId));
  const [deleteBook, { loading: deleting }] = useMutation(MUTATION_DELETE_BOOK);

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
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topSection}>
            {imageUri ? (
              <Image
                key={imageUri}
                source={{ uri: imageUri }}
                style={[styles.cover, bookShadow]}
              />
            ) : (
              <View
                style={[
                  styles.placeholderCover,
                  { backgroundColor },
                  bookShadow,
                ]}
              >
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
                  <Ionicons
                    name={getStatusBadge(book.status).icon}
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.statusBadgeText}>
                    {getStatusBadge(book.status).label}
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
              <Text style={styles.infoValue}>
                {getStatusBadge(book.status).label}
              </Text>
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
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.white}
                />
              }
            />

            <Button
              label="Supprimer"
              onPress={handleDelete}
              variant="danger"
              leftIcon={
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
              }
              loading={deleting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.background,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  errorText: {
    color: colors.danger,
    fontSize: spacing.lg,
  },
  topSection: {
    flexDirection: "row",
    gap: spacing.lg,
    alignItems: "flex-start",
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: radius.sm,
    backgroundColor: colors.borderSoft,
  },
  placeholderCover: {
    width: 120,
    height: 180,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderLetter: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.white,
  },
  mainInfos: {
    flex: 1,
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryMedium,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
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
    gap: spacing.sm,
    backgroundColor: colors.favoriteLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  favoriteBadgeText: {
    color: colors.favorite,
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.muted,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
  },
  actions: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
});

export default BookDetailsScreen;
