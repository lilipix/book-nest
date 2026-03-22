import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import BookList from "../components/BookList";
import FilterSegment from "../components/FilterSegment";
import { useBooks } from "../hooks/useBooks";
import SearchBar from "@/components/SearchBar";
import BookGridItem from "@/components/BookGridItem";
import { Book } from "@/gql/graphql";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { set } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { LibraryStackParamList } from "@/navigation/types";
import { Filter } from "types";

type LibraryRouteProp = RouteProp<LibraryStackParamList, "LibraryHome">;

export default function LibraryScreen() {
  const listRef = useRef<FlatList>(null);
  const [filter, setFilter] = useState<Filter | undefined>();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [highlightIsbn, setHighlightIsbn] = useState<string | undefined>();
  const [showScanMessage, setShowScanMessage] = useState(false);
  const navigation = useNavigation<LibraryRouteProp>();
  const route = useRoute<LibraryRouteProp>();
  const scannedIsbn = route.params?.scannedIsbn;
  const { books, loading, error, refetch } = useBooks(filter);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const scannedBook = useMemo(() => {
    if (!scannedIsbn) return undefined;
    return books.find((b) => b.isbn === scannedIsbn);
  }, [books, scannedIsbn]);

  useEffect(() => {
    if (scannedIsbn) {
      setHighlightIsbn(scannedIsbn);
      setShowScanMessage(true);
    }
  }, [scannedIsbn]);

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
    setHighlightIsbn(undefined);
    setShowScanMessage(false);
    navigation.setParams({ scannedIsbn: undefined });
  }, [navigation]);

  const openBook = (book: Book) => {
    console.log("openBook", book.id);
    navigation.navigate("BookDetails", { bookId: book.id });
  };

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
    [highlightIsbn, clearScanFeedback],
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erreur : {error.message}</Text>;

  const emptyMessage = normalizedSearch
    ? "Aucun livre ne correspond à votre recherche."
    : "Vous n'avez pas encore de livres dans votre bibliothèque.";

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <SearchBar onSearch={setSearch} onScanPress={openScanner} />
      {showScanMessage && (
        <View style={styles.scanCard}>
          <Text style={styles.scanCardText}>
            {scannedBook
              ? "Livre trouvé dans votre bibliothèque"
              : "Livre non trouvé dans votre bibliothèque"}
          </Text>

          {!scannedBook && (
            <Pressable
              style={({ pressed }) => [
                styles.addScannedButton,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                if (!scannedIsbn) return;
                navigation.navigate("MainTabs", {
                  screen: "Ajouter un livre",
                  params: {
                    screen: "AddBookHome",
                    params: { isbn: scannedIsbn },
                  },
                });
              }}
            >
              <Text style={styles.addScannedButtonText}>Ajouter ce livre</Text>
            </Pressable>
          )}
        </View>
      )}

      <FilterSegment active={filter} onChange={setFilter} />

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
  scanCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
  },

  scanCardText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "center",
  },

  addScannedButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0F766E",
    backgroundColor: "#FFFFFF",
  },

  addScannedButtonText: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.75,
  },
});
