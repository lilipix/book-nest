import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book } from "@/gql/graphql";

import {
  LibraryStackParamList,
  MainTabParamList,
  RootStackParamList,
} from "@/navigation/types";

import BookGridItem from "@/components/books/BookGridItem";
import ScanFeedBack from "@/components/ScanFeedback";
import SearchBar from "@/components/SearchBar";

import { Filter } from "@/types";

import { colors, spacing } from "@/styles/theme";

import FilterSegment from "../components/FilterSegment";
import { useBooks } from "../hooks/useBooks";

type LibraryRouteProp = RouteProp<LibraryStackParamList, "LibraryHome">;

type LibraryNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<LibraryStackParamList, "LibraryHome">,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, "Bibliothèque">,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNavigationProp>();
  const route = useRoute<LibraryRouteProp>();
  const scannedIsbn = route.params?.scannedIsbn;

  const listRef = useRef<FlatList>(null);

  const [filter, setFilter] = useState<Filter | undefined>();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedScanIsbn, setDismissedScanIsbn] = useState<
    string | undefined
  >();

  const { books, loading, error, refetch } = useBooks(filter);

  const normalizedSearch = search.trim().toLowerCase();

  const highlightIsbn =
    scannedIsbn && scannedIsbn !== dismissedScanIsbn ? scannedIsbn : undefined;

  const showScanMessage = !!scannedIsbn && scannedIsbn !== dismissedScanIsbn;

  const scannedBook = useMemo(() => {
    if (!scannedIsbn) return undefined;
    return books.find((b) => b.isbn === scannedIsbn);
  }, [books, scannedIsbn]);

  const filteredBooks = useMemo(() => {
    let result = books;

    if (normalizedSearch) {
      result = result.filter((book) => {
        return (
          book.title.toLowerCase().includes(normalizedSearch) ||
          book.author.toLowerCase().includes(normalizedSearch) ||
          book.isbn?.toLowerCase().includes(normalizedSearch)
        );
      });
    }

    if (scannedBook) {
      result = [
        scannedBook,
        ...result.filter((book) => book.id !== scannedBook.id),
      ];
    }

    return result;
  }, [books, normalizedSearch, scannedBook]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (!scannedBook || filteredBooks.length === 0) return;

    const index = filteredBooks.findIndex((b) => b.id === scannedBook.id);

    if (index !== -1) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index,
          animated: true,
        });
      });
    }
  }, [scannedBook, filteredBooks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openScanner = () => {
    navigation.navigate("ScanBook", { mode: "search" });
  };

  const clearScanFeedback = useCallback(() => {
    if (scannedIsbn) {
      setDismissedScanIsbn(scannedIsbn);
    }
    navigation.setParams({ scannedIsbn: undefined });
  }, [navigation, scannedIsbn]);

  const openBook = useCallback(
    (book: Book) => {
      navigation.navigate("BookDetails", { bookId: Number(book.id) });
    },
    [navigation],
  );

  const openAddBookFromScan = useCallback(() => {
    if (!scannedIsbn) return;

    navigation.navigate("MainTabs", {
      screen: "Ajouter un livre",
      params: {
        screen: "AddBookHome",
        params: { isbn: scannedIsbn },
      },
    });
  }, [navigation, scannedIsbn]);

  const emptyMessage = normalizedSearch
    ? "Aucun livre ne correspond à votre recherche."
    : "Vous n'avez pas encore de livres dans votre bibliothèque.";

  const renderItem = useCallback(
    ({ item }: { item: Book }) => (
      <BookGridItem
        book={item}
        highlighted={item.isbn === highlightIsbn}
        onPress={() => {
          clearScanFeedback();
          openBook(item);
        }}
      />
    ),
    [highlightIsbn, clearScanFeedback, openBook],
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erreur : {error.message}</Text>;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right"]}
    >
      <SearchBar onSearch={setSearch} onScanPress={openScanner} />
      {showScanMessage && (
        <ScanFeedBack
          found={!!scannedBook}
          scannedIsbn={scannedIsbn}
          onAddBook={openAddBookFromScan}
        />
      )}

      <FilterSegment active={filter} onChange={setFilter} />
      <View style={styles.bookCountContainer}>
        <Text>Nombres de livres : {filteredBooks.length}</Text>
      </View>

      {filteredBooks.length === 0 ? (
        <View>
          <Text>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={renderItem}
          initialNumToRender={12}
          windowSize={10}
          removeClippedSubviews
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
          onScrollBeginDrag={clearScanFeedback}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bookCountContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: spacing.md,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
});
