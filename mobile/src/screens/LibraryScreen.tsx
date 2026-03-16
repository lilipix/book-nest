import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import BookList from "../components/BookList";
import FilterSegment from "../components/FilterSegment";
import { useBooks, Filter } from "../hooks/useBooks";
import SearchBar from "@/components/SearchBar";
import BookGridItem from "@/components/BookGridItem";
import { Book } from "@/gql/graphql";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function BooksScreen() {
  const [filter, setFilter] = useState<Filter | undefined>();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const { books, loading, error, refetch } = useBooks(filter);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [filter]),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredBooks = useMemo(() => {
    if (!normalizedSearch) return books;

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [books, normalizedSearch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
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
  const openScanner = () => {
    navigation.navigate("ScanBook", { mode: "search" });
  };

  const renderItem = useCallback(
    ({ item }: { item: Book }) => <BookGridItem book={item} />,
    [],
  );

  if (loading) return <ActivityIndicator />;

  if (error) return <Text>Erreur : {error.message}</Text>;

  const emptyMessage = normalizedSearch
    ? "Aucun livre ne correspond à votre recherche."
    : `Vous n'avez pas encore spécifié de ${getPageMessage(
        filter,
      )} dans votre bibliothèque.`;

  return (
    <View style={styles.container}>
      <SearchBar onSearch={setSearch} onScanPress={openScanner} />
      {/* <Text style={styles.title}>{getPageTitle(filter)}</Text> */}
      <FilterSegment active={filter} onChange={setFilter} />

      {filteredBooks.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={renderItem}
          initialNumToRender={12}
          windowSize={10}
          removeClippedSubviews
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
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
