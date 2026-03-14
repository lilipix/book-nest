import { Text, View } from "react-native";
import { Filter } from "../../types";

export default function LibraryScreen({ filter }: { filter: Filter }) {
  const { data } = useBooksQuery({ variables: { filter } });

  return (
    <View>
      <Text>My Library</Text>
      {data?.books.map((book) => (
        <Text key={book.id}>{book.title}</Text>
      ))}
    </View>
  );
}
