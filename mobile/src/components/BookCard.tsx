import { Book } from "@/gql/graphql";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  book: Book;
};

export default function BookCard({ book }: Props) {
  return (
    <View style={styles.card}>
      {book.image && (
        <Image source={{ uri: book.image }} style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        {book.isFavorite && <Text style={styles.tag}>⭐ Favori</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  tag: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },
});
