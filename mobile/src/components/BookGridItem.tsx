import { Image, Pressable,StyleSheet, Text, View } from "react-native";

import { Book, BookStatus } from "@/gql/graphql";

import { getBookImageUri } from "@/utils/image";
import { getBookColor } from "@/utils/style";

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
          <Image source={{ uri: imageUri }} style={styles.cover} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor }]}>
            <Text numberOfLines={4} style={styles.placeholderTitle}>
              {book.title}
            </Text>
          </View>
        )}

        {book.isFavorite && (
          <View style={[styles.badge, styles.favorite]}>
            <Text style={styles.badgeText}>⭐</Text>
          </View>
        )}

        {book.status === BookStatus.Read && (
          <View style={[styles.badge, styles.read]}>
            <Text style={styles.badgeText}>📖</Text>
          </View>
        )}

        {book.borrowedBy && (
          <View style={[styles.badge, styles.borrowed]}>
            <Text style={styles.badgeText}>🤝</Text>
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
  },

  coverContainer: {
    position: "relative",
  },

  cover: {
    width: 110,
    height: 160,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  placeholder: {
    width: 110,
    height: 160,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  placeholderTitle: {
    color: "#1F2937",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
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
    borderRadius: 10,
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
  badgeText: {
    fontSize: 12,
  },
  foundBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 2,
  },
  foundBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
