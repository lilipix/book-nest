import {
  View,
  Text,
  Switch,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BookStatus } from "@/gql/graphql";
import { useMutation } from "@apollo/client/react";
import { MUTATION_CREATE_BOOK } from "@/api/CreateBook";
import { QUERY_BOOKS } from "@/api/Books";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddBookStackParamList } from "@/navigation/types";

type AddBookRouteProp = RouteProp<AddBookStackParamList, "AddBookHome">;

export const CreateBookSchema = z.object({
  title: z.string().min(2, "Titre trop court"),
  author: z.string().min(2, "Auteur trop court"),
  image: z.string().url("URL invalide").optional().or(z.literal("")).nullable(),
  status: z.enum(BookStatus),
  isFavorite: z.boolean(),
  isbn: z.string().optional(),
});

export type CreateBookFormValues = z.infer<typeof CreateBookSchema>;

export default function AddBookScreen() {
  const route = useRoute<AddBookRouteProp>();
  const navigation = useNavigation<any>();
  const isbn = route.params?.isbn;

  const [loadingBook, setLoadingBook] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createBook, { loading }] = useMutation(MUTATION_CREATE_BOOK, {
    refetchQueries: [{ query: QUERY_BOOKS }],
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBookFormValues>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: {
      title: "",
      author: "",
      image: null,
      status: BookStatus.Unread,
      isFavorite: false,
      isbn: isbn || undefined,
    },
  });

  const imageValue = watch("image");

  const onSubmit = async (data: CreateBookFormValues) => {
    try {
      await createBook({
        variables: { data: { ...data, isbn: isbn } },
      });

      navigation.navigate("MainTabs", {
        screen: "Bibliothèque",
        params: {
          screen: "LibraryHome",
          params: { scannedIsbn: isbn },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isbn) return;

    const fetchBook = async () => {
      try {
        setError(null);
        setLoadingBook(true);

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
        );
        const data = await res.json();

        if (data.totalItems > 0) {
          const book = data.items[0].volumeInfo;

          setValue("title", book.title || "");
          setValue("author", book.authors?.join(", ") || "");
          setValue("image", book.imageLinks?.thumbnail || null);
        } else {
          setError("Livre non trouvé, saisie manuelle requise.");
        }
      } catch (e) {
        console.error(e);
        setError("Une erreur est survenue pendant la recherche du livre.");
      } finally {
        setLoadingBook(false);
      }
    };

    fetchBook();
  }, [isbn, setValue]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Scanne un ISBN ou complète le formulaire manuellement
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recherche rapide</Text>

          {loadingBook && (
            <View style={styles.infoRow}>
              <ActivityIndicator size="small" color="#0F766E" />
              <Text style={styles.infoText}>Chargement du livre...</Text>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ScanBook", { mode: "add" })}
          >
            <Ionicons name="barcode-outline" size={22} color="#0F766E" />
            <Text style={styles.secondaryButtonText}>Scanner un ISBN</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations du livre</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Titre</Text>
                <TextInput
                  placeholder="Ex. Le Petit Prince"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, errors.title && styles.inputError]}
                />
                {errors.title && (
                  <Text style={styles.error}>{errors.title.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="author"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Auteur</Text>
                <TextInput
                  placeholder="Ex. Antoine de Saint-Exupéry"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, errors.author && styles.inputError]}
                />
                {errors.author && (
                  <Text style={styles.error}>{errors.author.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>URL de la couverture</Text>
                <TextInput
                  placeholder="https://..."
                  placeholderTextColor="#9CA3AF"
                  value={value || ""}
                  onChangeText={(text) => onChange(text || null)}
                  style={[styles.input, errors.image && styles.inputError]}
                  autoCapitalize="none"
                />
                {errors.image && (
                  <Text style={styles.error}>{errors.image.message}</Text>
                )}
              </View>
            )}
          />

          {!!imageValue && (
            <View style={styles.previewWrapper}>
              <Text style={styles.previewLabel}>Aperçu</Text>
              <Image
                source={{ uri: imageValue }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Statut</Text>

          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <View style={styles.statusContainer}>
                <Pressable
                  style={[
                    styles.statusButton,
                    value === BookStatus.Read && styles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.Read)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      value === BookStatus.Read && styles.activeStatusText,
                    ]}
                  >
                    Lu
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusButton,
                    value === BookStatus.ToRead && styles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.ToRead)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      value === BookStatus.ToRead && styles.activeStatusText,
                    ]}
                  >
                    À lire
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusButton,
                    value === BookStatus.Unread && styles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.Unread)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      value === BookStatus.Unread && styles.activeStatusText,
                    ]}
                  >
                    Non lu
                  </Text>
                </Pressable>
              </View>
            )}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Options</Text>

          <Controller
            control={control}
            name="isFavorite"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Ajouter aux favoris</Text>
                  <Text style={styles.switchHint}>
                    Pour retrouver ce livre plus rapidement
                  </Text>
                </View>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            loading && styles.primaryButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Enregistrer</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    color: "#111827",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  error: {
    color: "#DC2626",
    marginTop: 6,
    fontSize: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },

  infoText: {
    color: "#6B7280",
    fontSize: 14,
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#0F766E",
    backgroundColor: "#ECFDF5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#0F766E",
    fontWeight: "600",
    fontSize: 15,
  },

  previewWrapper: {
    marginTop: 8,
    alignItems: "center",
  },

  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },

  previewImage: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  statusContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },

  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeStatusButton: {
    backgroundColor: "#0F766E",
  },

  statusText: {
    color: "#374151",
    fontWeight: "500",
    fontSize: 14,
  },

  activeStatusText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchLabel: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: 4,
  },

  switchHint: {
    fontSize: 13,
    color: "#6B7280",
    maxWidth: 220,
  },

  primaryButton: {
    backgroundColor: "#0F766E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
