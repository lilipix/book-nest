import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
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

import BookCoverField from "@/components/books/BookCoverFields";
import FormField from "@/components/books/FormField";
import SettingSwitchRow from "@/components/books/OptionSwitchRow";
import StatusSelector from "@/components/books/StatusSelector";
import Button from "@/components/ui/Button";

import { isLocalImage, optimizeImageBeforeUpload } from "@/utils/image";

import { fetchBookByIsbn } from "@/services/bookLookup";
import { uploadBookCover } from "@/services/uploadBookCover";

import { formStyles } from "@/styles/formStyles";
import { colors, radius, spacing } from "@/styles/theme";

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

      if (!bookId) {
        throw new Error("ID manquant");
      }

      reset(defaultFormValues);

      if (image && isLocalImage(image)) {
        try {
          const optimizedImage = await optimizeImageBeforeUpload(image);
          await uploadBookCover(String(bookId), optimizedImage.uri);
        } catch {
          Alert.alert(
            "Livre ajouté",
            "Le livre a bien été ajouté, mais la couverture n'a pas pu être envoyée.",
          );

          navigation.navigate("MainTabs", {
            screen: "Bibliothèque",
            params: {
              screen: "LibraryHome",
            },
          });

          return;
        }
      }

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
            Scannez un ISBN ou complètez le formulaire manuellement.
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
              <FormField
                label="Titre"
                placeholder="Ex. Le Petit Prince"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="author"
            render={({ field: { onChange, value } }) => (
              <FormField
                label="Auteur"
                placeholder="Ex. Antoine de Saint-Exupéry"
                value={value}
                onChangeText={onChange}
                error={errors.author?.message}
              />
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
              <StatusSelector value={value} onChange={onChange} />
            )}
          />
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Options</Text>

          <Controller
            control={control}
            name="isFavorite"
            render={({ field: { onChange, value } }) => (
              <SettingSwitchRow
                label="Ajouter aux favoris"
                hint="Pour retrouver ce livre plus rapidement"
                value={value}
                onValueChange={onChange}
              />
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
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  infoText: {
    color: colors.muted,
    fontSize: 14,
  },

  previewWrapper: {
    marginTop: spacing.sm,
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
    borderRadius: radius.sm,
    backgroundColor: colors.borderSoft,
  },
});
