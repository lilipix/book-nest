import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { useMutation } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { QUERY_BOOKS } from "@/api/Books";
import { MUTATION_CREATE_BOOK } from "@/api/CreateBook";
import { BookStatus } from "@/gql/graphql";

import { AddBookStackParamList } from "@/navigation/types";

import { useBookCoverPicker } from "@/hooks/useBookCoverPicker";

import BookCoverField from "@/components/BookCoverFields";

import { isLocalImage } from "@/utils/image";

import { fetchBookByIsbn } from "@/services/bookLookup";
import { uploadBookCover } from "@/services/uploadBookCover";

import { formStyles } from "@/styles/formStyles";
import { colors } from "@/styles/theme";
import Button from "@/ui/Button";

type AddBookRouteProp = RouteProp<AddBookStackParamList, "AddBookHome">;

const CreateBookSchema = z.object({
  title: z.string().min(2, "Titre trop court"),
  author: z.string().min(2, "Auteur trop court"),
  image: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(BookStatus),
  isFavorite: z.boolean(),
  isbn: z.string().optional(),
});

export type CreateBookFormValues = z.infer<typeof CreateBookSchema>;

export default function AddBookScreen() {
  const route = useRoute<AddBookRouteProp>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const isbn = route.params?.isbn;

  const [isFetchingBook, setIsFetchingBook] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { takePhoto, pickImageFromLibrary, removeImage } = useBookCoverPicker({
    onChange: (uri) =>
      setValue("image", uri ?? "", { shouldDirty: true, shouldValidate: true }),
  });

  const [createBook, { loading }] = useMutation(MUTATION_CREATE_BOOK, {
    refetchQueries: [{ query: QUERY_BOOKS }],
  });

  const defaultFormValues: CreateBookFormValues = {
    title: "",
    author: "",
    image: undefined,
    status: BookStatus.Unread,
    isFavorite: false,
    isbn: isbn || undefined,
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBookFormValues>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: defaultFormValues,
  });

  const imageValue = watch("image");

  useFocusEffect(
    useCallback(() => {
      if (!isbn) {
        reset(defaultFormValues);
        setError(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isbn, reset]),
  );

  const onSubmit = async (data: CreateBookFormValues) => {
    try {
      const image = data.image?.trim() || undefined;

      const payload = {
        ...data,
        isbn,
        ...(image && !isLocalImage(image) ? { image } : {}),
      };

      const res = await createBook({
        variables: {
          data: payload,
        },
      });

      const bookId = res.data?.createBook?.id;

      if (!bookId) throw new Error("ID manquant");

      if (image && isLocalImage(image)) {
        await uploadBookCover(bookId, image);
      }

      reset(defaultFormValues);

      Alert.alert("Succès", "Livre créé");

      navigation.navigate("MainTabs", {
        screen: "Bibliothèque",
        params: {
          screen: "LibraryHome",
        },
      });
    } catch (e: unknown) {
      let graphqlMessage = "Impossible de créer le livre.";
      if (typeof e === "object" && e !== null) {
        graphqlMessage =
          (e as { graphQLErrors?: { message?: string }[] })?.graphQLErrors?.[0]
            ?.message ||
          (
            e as {
              networkError?: { result?: { errors?: { message?: string }[] } };
            }
          )?.networkError?.result?.errors?.[0]?.message ||
          (e as { message?: string })?.message ||
          graphqlMessage;
      }

      if (graphqlMessage === "Ce livre existe déjà dans la bibliothèque") {
        Alert.alert("Livre déjà présent dans la bibliothèque", graphqlMessage);
        return;
      }
      Alert.alert("Erreur", graphqlMessage);
    }
  };

  const lastFetchedIsbn = useRef<string | null>(null);

  useEffect(() => {
    if (!isbn) return;
    if (lastFetchedIsbn.current === isbn) return;

    lastFetchedIsbn.current = isbn;

    const loadBook = async () => {
      if (isFetchingBook) return;
      try {
        setIsFetchingBook(true);
        setLoadingBook(true);
        setError("");

        const result = await fetchBookByIsbn(isbn);

        if (!result.found) {
          setValue("title", "");
          setValue("author", "");
          setValue("image", "", { shouldDirty: true });
          setError("Livre non trouvé, saisie manuelle requise.");
          return;
        }

        setValue("title", result.title);
        setValue("author", result.author);
        setValue("image", result.image, { shouldDirty: true });

        if (!result.image) {
          setError(
            "Livre trouvé, mais aucune couverture n'est disponible. Vous pouvez prendre une photo.",
          );
        }
      } catch (e: unknown) {
        const message =
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message?: string }).message)
            : "";

        if (message.includes("429")) {
          Alert.alert(
            "Trop de requêtes",
            "Google Books limite temporairement les recherches. Réessayer dans quelques instants.",
          );
          return;
        }

        Alert.alert(
          "Erreur",
          "Impossible de récupérer les informations du livre.",
        );
      } finally {
        setIsFetchingBook(false);
        setLoadingBook(false);
      }
    };
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbn, setValue]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView
        style={formStyles.container}
        contentContainerStyle={formStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={formStyles.header}>
          <Text style={formStyles.subtitle}>
            Scanne un ISBN ou complète le formulaire manuellement
          </Text>
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Recherche rapide</Text>

          {loadingBook && (
            <View style={styles.infoRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.infoText}>Chargement du livre...</Text>
            </View>
          )}

          {error && <Text style={formStyles.error}>{error}</Text>}

          <Button
            label="Scanner un ISBN"
            variant="secondary"
            onPress={() => navigation.navigate("ScanBook", { mode: "add" })}
            leftIcon={
              <Ionicons
                name="barcode-outline"
                size={22}
                color={colors.primary}
              />
            }
          />
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Informations du livre</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={formStyles.fieldGroup}>
                <Text style={formStyles.label}>Titre</Text>
                <TextInput
                  placeholder="Ex. Le Petit Prince"
                  placeholderTextColor={colors.muted}
                  value={value}
                  onChangeText={onChange}
                  style={[
                    formStyles.input,
                    errors.title && formStyles.inputError,
                  ]}
                />
                {errors.title && (
                  <Text style={formStyles.error}>{errors.title.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="author"
            render={({ field: { onChange, value } }) => (
              <View style={formStyles.fieldGroup}>
                <Text style={formStyles.label}>Auteur</Text>
                <TextInput
                  placeholder="Ex. Antoine de Saint-Exupéry"
                  placeholderTextColor={colors.muted}
                  value={value}
                  onChangeText={onChange}
                  style={[
                    formStyles.input,
                    errors.author && formStyles.inputError,
                  ]}
                />
                {errors.author && (
                  <Text style={formStyles.error}>{errors.author.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="image"
            render={() => (
              <View style={formStyles.fieldGroup}>
                <BookCoverField
                  value={imageValue}
                  onTakePhoto={takePhoto}
                  onPickImage={pickImageFromLibrary}
                  onRemoveImage={removeImage}
                  mode="create"
                />
                {errors.image && (
                  <Text style={formStyles.error}>{errors.image.message}</Text>
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

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Statut</Text>

          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <View style={formStyles.statusContainer}>
                <Pressable
                  style={[
                    formStyles.statusButton,
                    value === BookStatus.Read && formStyles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.Read)}
                >
                  <Text
                    style={[
                      formStyles.statusText,
                      value === BookStatus.Read && formStyles.activeStatusText,
                    ]}
                  >
                    Lu
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    formStyles.statusButton,
                    value === BookStatus.ToRead &&
                      formStyles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.ToRead)}
                >
                  <Text
                    style={[
                      formStyles.statusText,
                      value === BookStatus.ToRead &&
                        formStyles.activeStatusText,
                    ]}
                  >
                    À lire
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    formStyles.statusButton,
                    value === BookStatus.Unread &&
                      formStyles.activeStatusButton,
                  ]}
                  onPress={() => onChange(BookStatus.Unread)}
                >
                  <Text
                    style={[
                      formStyles.statusText,
                      value === BookStatus.Unread &&
                        formStyles.activeStatusText,
                    ]}
                  >
                    Non lu
                  </Text>
                </Pressable>
              </View>
            )}
          />
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Options</Text>

          <Controller
            control={control}
            name="isFavorite"
            render={({ field: { onChange, value } }) => (
              <View style={formStyles.switchRow}>
                <View>
                  <Text style={formStyles.switchLabel}>
                    Ajouter aux favoris
                  </Text>
                  <Text style={formStyles.switchHint}>
                    Pour retrouver ce livre plus rapidement
                  </Text>
                </View>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />
        </View>

        <Button
          label="Enregistrer"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },

  infoText: {
    color: colors.muted,
    fontSize: 14,
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.primary,
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
    color: colors.textSecondary,
    marginBottom: 10,
  },

  previewImage: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.borderSoft,
  },
});
