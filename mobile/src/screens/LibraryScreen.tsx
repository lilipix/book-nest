import React, { useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import BookList from "../components/BookList";
import FilterSegment from "../components/FilterSegment";
import { useBooks, Filter } from "../hooks/useBooks";

export default function BooksScreen() {
  const [filter, setFilter] = useState<Filter | undefined>();

  const { books, loading, error } = useBooks(filter);

  const getPageTitle = (filter?: Filter) => {
    switch (filter) {
      case Filter.ToRead:
        return "Livres à lire";
      case Filter.Favorites:
        return "Livres favoris";
      case Filter.Borrowed:
        return "Livres prêtés";
      default:
        return "Tous les livres";
    }
  };

  const getPageMessage = (filter?: Filter) => {
    switch (filter) {
      case Filter.ToRead:
        return "livres à lire";
      case Filter.Read:
        return "livres lus";
      case Filter.Favorites:
        return "livres favoris";
      case Filter.Borrowed:
        return "livres prêtés";
      default:
        return "livres";
    }
  };

  if (loading) return <ActivityIndicator />;

  if (error) return <Text>Erreur : {error.message}</Text>;

  const emptyMessage = `Vous n'avez pas encore spécifié de ${getPageMessage(
    filter,
  )} dans votre bibliothèque.`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getPageTitle(filter)}</Text>
      <FilterSegment onChange={setFilter} />

      {books.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        <BookList books={books} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
