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
  Touchable,
  TouchableOpacity,
  Pressable,
} from "react-native";
import BookList from "../components/BookList";
import FilterSegment from "../components/FilterSegment";
import { useBooks, Filter } from "../hooks/useBooks";
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

type LibraryRouteParams = {
  Library: { scannedIsbn?: string } | undefined;
};

// export default function BooksScreen() {
//   const listRef = useRef<FlatList>(null);
//   const [filter, setFilter] = useState<Filter | undefined>();
//   const [search, setSearch] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const navigation = useNavigation<any>();
//   const route = useRoute<RouteProp<LibraryRouteParams, "Library">>();
//   const scannedIsbn = route.params?.scannedIsbn;

//   const { books, loading, error, refetch } = useBooks(filter);

//   useEffect(() => {
//     if (!scannedIsbn) return;

//     const index = books.findIndex((b) => b.isbn === scannedIsbn);

//     if (index !== -1) {
//       listRef.current?.scrollToIndex({
//         index,
//         animated: true,
//       });
//     }
//   }, [scannedIsbn, books]);

//   useFocusEffect(
//     useCallback(() => {
//       refetch();
//     }, [refetch]),
//   );

//   const normalizedSearch = search.trim().toLowerCase();

//   const filteredBooks = useMemo(() => {
//     if (!normalizedSearch) return books;

//     return books.filter((book) => {
//       return (
//         book.title.toLowerCase().includes(normalizedSearch) ||
//         book.author.toLowerCase().includes(normalizedSearch)
//       );
//     });
//   }, [books, normalizedSearch]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     setRefreshing(false);
//   };
//   const getPageTitle = (filter?: Filter) => {
//     switch (filter) {
//       case Filter.ToRead:
//         return "Livres à lire";
//       case Filter.Favorites:
//         return "Livres favoris";
//       case Filter.Borrowed:
//         return "Livres prêtés";
//       default:
//         return "Tous les livres";
//     }
//   };

//   const getPageMessage = (filter?: Filter) => {
//     switch (filter) {
//       case Filter.ToRead:
//         return "livres à lire";
//       case Filter.Read:
//         return "livres lus";
//       case Filter.Favorites:
//         return "livres favoris";
//       case Filter.Borrowed:
//         return "livres prêtés";
//       default:
//         return "livres";
//     }
//   };
//   const openScanner = () => {
//     navigation.navigate("ScanBook", { mode: "search" });
//   };

//   const addBook = () => {
//     navigation.navigate("CreateBook");
//   };

//   const renderItem = useCallback(
//     ({ item }: { item: Book }) => (
//       <BookGridItem book={item} highlighted={item.isbn === scannedIsbn} />
//     ),
//     [],
//   );

//   if (loading) return <ActivityIndicator />;

//   if (error) return <Text>Erreur : {error.message}</Text>;

//   const index = books.findIndex((b) => b.isbn === scannedIsbn);
//   listRef.current?.scrollToIndex({
//     index,
//     animated: true,
//   });
//   const emptyMessage = normalizedSearch
//     ? "Aucun livre ne correspond à votre recherche."
//     : `Vous n'avez pas encore spécifié de ${getPageMessage(
//         filter,
//       )} dans votre bibliothèque.`;

//   return (
//     <SafeAreaView style={styles.container} edges={["left", "right"]}>
//       <SearchBar onSearch={setSearch} onScanPress={openScanner} />
//       <FilterSegment active={filter} onChange={setFilter} />

//       {filteredBooks.length === 0 ? (
//         <View>
//           <Text style={styles.empty}>{emptyMessage}</Text>
//         </View>
//       ) : (
//         <FlatList
//           ref={listRef}
//           data={filteredBooks}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={3}
//           renderItem={renderItem}
//           initialNumToRender={12}
//           windowSize={10}
//           removeClippedSubviews
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           contentContainerStyle={{ paddingBottom: 100 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   empty: {
//     textAlign: "center",
//     marginTop: 40,
//     fontSize: 16,
//     color: "#666",
//   },
// });
export default function LibraryScreen() {
  console.log("LibraryScreen render");

  const listRef = useRef<FlatList>(null);
  const [filter, setFilter] = useState<Filter | undefined>();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<LibraryRouteParams, "Library">>();
  const scannedIsbn = route.params?.scannedIsbn;
  console.log("route.params", route.params);
  const { books, loading, error, refetch } = useBooks(filter);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const scannedBook = useMemo(() => {
    if (!scannedIsbn) return undefined;
    console.log("scannedIsbn", scannedIsbn);
    console.log("books", books);
    console.log(
      "found",
      books.find((b) => b.isbn === scannedIsbn),
    );
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

  const addBook = () => {
    navigation.navigate("CreateBook");
  };

  const renderItem = useCallback(
    ({ item }: { item: Book }) => (
      <BookGridItem book={item} highlighted={item.id === scannedBook?.id} />
    ),
    [scannedBook],
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erreur : {error.message}</Text>;

  const emptyMessage = normalizedSearch
    ? "Aucun livre ne correspond à votre recherche."
    : "Vous n'avez pas encore de livres dans votre bibliothèque.";

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <SearchBar onSearch={setSearch} onScanPress={openScanner} />
      <FilterSegment active={filter} onChange={setFilter} />

      {scannedIsbn && scannedBook && (
        <Text style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          Livre trouvé dans votre bibliothèque
        </Text>
      )}

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
        />
      )}
    </SafeAreaView>
  );
}
