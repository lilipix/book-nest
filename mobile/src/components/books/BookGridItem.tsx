import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Book, BookStatus } from "@/gql/graphql";

import { getBookImageUri } from "@/utils/image";
import { getBookColor } from "@/utils/style";

import { bookShadow, colors, radius } from "@/styles/theme";

type BookGridItemProps = {
  book: Book;
  onPress: () => void;
  highlighted?: boolean;
};

// TODO AJOUTER MEMO
export default function BookGridItem({
  book,
  onPress,
  highlighted = false,
}: BookGridItemProps) {
  const backgroundColor = getBookColor(book.title);
  const imageUri = getBookImageUri(book.image);
  return (
    <Pressable style={[styles.container]} onPress={onPress}>
      <View style={styles.coverContainer}>
        {highlighted && (
          <View style={styles.foundBadge}>
            <Text style={styles.foundBadgeText}>Trouvé</Text>
          </View>
        )}
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.cover, bookShadow]}
          />
        ) : (
          <View
            style={[styles.placeholderCover, { backgroundColor }, bookShadow]}
          >
            <Text style={styles.placeholderLetter}>
              {book.title?.charAt(0)?.toUpperCase() || "L"}
            </Text>
          </View>
        )}

        {book.isFavorite && (
          <View style={[styles.badge, styles.favorite]}>
            <Ionicons name="heart" size={12} color={colors.danger} />
          </View>
        )}

        {book.status === BookStatus.Read && (
          <View style={[styles.badge, styles.read]}>
            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
          </View>
        )}

        {book.status === BookStatus.ToRead && (
          <View style={[styles.badge, styles.read]}>
            <Ionicons name="book-outline" size={12} color="#444" />
          </View>
        )}

        {book.borrowedBy && (
          <View style={[styles.badge, styles.borrowed]}>
            <Ionicons name="person-outline" size={12} color="#c27c2c" />
          </View>
        )}
      </View>

      <Text numberOfLines={2} style={styles.title}>
        {book.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  coverContainer: {
    position: "relative",
  },

  cover: {
    width: 110,
    height: 160,
    borderRadius: radius.sm,
    // shadowColor: "#000",
    // shadowOpacity: 0.12,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 3,
  },
  placeholderCover: {
    width: 110,
    height: 160,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOpacity: 0.12,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 3,
  },
  placeholderLetter: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.white,
  },
  title: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    color: "#1F2937",
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    padding: 4,
    borderRadius: radius.md,
    zIndex: 10,
  },
  favorite: {
    top: 4,
    right: 4,
    backgroundColor: "white",
  },
  read: {
    bottom: 4,
    left: 4,
    backgroundColor: "white",
  },
  borrowed: {
    bottom: 4,
    right: 4,
    backgroundColor: "white",
  },
  foundBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    zIndex: 2,
  },
  foundBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
