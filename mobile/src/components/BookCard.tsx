// import { Book } from "@/gql/graphql";
// import React from "react";
// import { View, Text, Image, StyleSheet } from "react-native";

// type Props = {
//   book: Book;
// };

// export default function BookCard({ book }: Props) {
//   return (
//     <View style={styles.card}>
//       {book.image && (
//         <Image source={{ uri: book.image }} style={styles.image} />
//       )}

//       <View style={styles.info}>
//         <Text style={styles.title}>{book.title}</Text>
//         <Text style={styles.author}>{book.author}</Text>

//         {book.isFavorite && <Text style={styles.tag}>⭐ Favori</Text>}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   image: {
//     width: 60,
//     height: 90,
//     borderRadius: 4,
//   },
//   info: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   author: {
//     fontSize: 14,
//     color: "#555",
//     marginTop: 4,
//   },
//   tag: {
//     marginTop: 6,
//     fontSize: 12,
//     color: "#888",
//   },
// });
// import { View, Text, Image, StyleSheet, Pressable } from "react-native";
// import { Book } from "@/gql/graphql";

// type Props = {
//   book: Book;
//   onPress: () => void;
// };

// export default function BookCard({ book, onPress }: Props) {
//   return (
//     <Pressable style={styles.card} onPress={onPress}>
//       <Image
//         source={{
//           uri: book.image || "https://via.placeholder.com/60x90",
//         }}
//         style={styles.cover}
//       />

//       <View style={styles.info}>
//         <Text style={styles.title}>{book.title}</Text>
//         <Text style={styles.author}>{book.author}</Text>

//         <View style={styles.badges}>
//           {book.isFavorite && <Text style={styles.badge}>⭐ Favori</Text>}

//           {book.status === "READ" && <Text style={styles.badge}>📖 Lu</Text>}

//           {book.borrowedBy && <Text style={styles.badge}>🤝 Prêté</Text>}
//         </View>
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     padding: 12,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     backgroundColor: "white",
//     borderRadius: 10,
//     elevation: 2,
//   },

//   cover: {
//     width: 60,
//     height: 90,
//     borderRadius: 4,
//   },

//   info: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: "center",
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   author: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 6,
//   },

//   badges: {
//     flexDirection: "row",
//     gap: 8,
//   },

//   badge: {
//     fontSize: 12,
//     backgroundColor: "#eee",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
// });
// import { View, Text, Image, StyleSheet, Pressable } from "react-native";
// import { Book } from "@/gql/graphql";

// type Props = {
//   book: Book;
//   onPress: () => void;
// };

// export default function BookGridItem({ book, onPress }: Props) {
//   return (
//     <Pressable style={styles.container} onPress={onPress}>
//       <Image
//         source={{
//           uri: book.image || "https://via.placeholder.com/120x180",
//         }}
//         style={styles.cover}
//       />

//       <Text numberOfLines={2} style={styles.title}>
//         {book.title}
//       </Text>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     margin: 6,
//     alignItems: "center",
//   },

//   cover: {
//     width: 110,
//     height: 160,
//     borderRadius: 6,
//   },

//   title: {
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: "center",
//   },
// });
