import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Book, BookStatus } from "@/gql/graphql";
import { getBookColor } from "@/utils";

type Props = {
  book: Book;
  onPress: () => void;
  highlighted?: boolean;
};

// TODO AJOUTER MEMO
export default function BookGridItem({
  book,
  onPress,
  highlighted = false,
}: Props) {
  const backgroundColor = getBookColor(book.title);
  return (
    <Pressable
      style={[styles.container, highlighted && styles.highlightedContainer]}
      onPress={onPress}
    >
      <View style={styles.coverContainer}>
        {book.image ? (
          <Image source={{ uri: book.image }} style={styles.cover} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor }]}>
            <Text numberOfLines={4} style={styles.placeholderTitle}>
              {book.title}
            </Text>
          </View>
        )}

        {/* Favori */}
        {book.isFavorite && (
          <View style={[styles.badge, styles.favorite]}>
            <Text style={styles.badgeText}>⭐</Text>
          </View>
        )}

        {/* Lu */}
        {book.status === BookStatus.Read && (
          <View style={[styles.badge, styles.read]}>
            <Text style={styles.badgeText}>📖</Text>
          </View>
        )}

        {/* Prêté */}
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
    borderRadius: 6,

    // Ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    // Ombre Android
    elevation: 4,
  },

  placeholder: {
    width: 110,
    height: 160,
    borderRadius: 6,
    justifyContent: "center",
    padding: 8,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    elevation: 4,
  },
  placeholderTitle: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  title: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
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
  // highlighted: {
  //   borderWidth: 3,
  //   borderColor: "#4CAF50",
  // },
  highlightedContainer: {
    borderWidth: 5,
    borderColor: "#009688",
    backgroundColor: "#E8F6F4",
  },
});
