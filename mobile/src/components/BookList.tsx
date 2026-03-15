import React from "react";
import { FlatList } from "react-native";
import BookCard from "./BookCard";
import { Book } from "@/gql/graphql";

type Props = {
  books: Book[];
};

export default function BookList({ books }: Props) {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <BookCard book={item} />}
    />
  );
}
