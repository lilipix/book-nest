import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useBookCoverPicker } from "@/hooks/useBookCoverPicker";
import { BookStatus } from "@/gql/graphql";
import { useBook } from "@/hooks/useBook";
import { useUpdateBook } from "@/hooks/useUpdateBook";
import { LibraryStackParamList } from "@/navigation/types";
import {
  dateToIsoOnly,
  isoDateRegex,
  isoDateToIsoDateTime,
  isoToDate,
  isoToFr,
  normalizeIsoDate,
} from "@/utils/dates";
import { getBookImageUri, isLocalImage } from "@/utils/image";
import { Ionicons } from "@expo/vector-icons";
import BookCoverField from "@/components/BookCoverFields";
import { uploadBookCover } from "@/api/uploadBookCover";

type EditBookRouteProp = RouteProp<LibraryStackParamList, "EditBook">;
type EditBookNavigationProp = NativeStackNavigationProp<
  LibraryStackParamList,
  "EditBook"
>;

const editBookSchema = z
  .object({
    status: z.nativeEnum(BookStatus),
    image: z.string().optional().nullable().or(z.literal("")),
    isFavorite: z.boolean(),
    isBorrowed: z.boolean(),
    borrowedBy: z.string(),
    borrowedAt: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.isBorrowed) {
      if (!values.borrowedBy.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["borrowedBy"],
          message:
            "Le nom de la personne est obligatoire si le livre est prêté.",
        });
      }

      if (!values.borrowedAt.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["borrowedAt"],
          message: "La date de prêt est obligatoire.",
        });
      } else if (!isoDateRegex.test(values.borrowedAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["borrowedAt"],
          message: "Date invalide.",
        });
      }
    }
  });

type EditBookFormValues = z.infer<typeof editBookSchema>;

export default function EditBookScreen() {
  const route = useRoute<EditBookRouteProp>();
  const navigation = useNavigation<EditBookNavigationProp>();
  const { bookId } = route.params;
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const { takePhoto, pickImageFromLibrary, removeImage } = useBookCoverPicker({
    onChange: setCoverUri,
  });
  const { book, loading, error } = useBook(String(bookId));
  const { updateBook, loading: updating } = useUpdateBook();

  const [showIOSBorrowedPicker, setShowIOSBorrowedPicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditBookFormValues>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      status: BookStatus.ToRead,
      isFavorite: false,
      isBorrowed: false,
      borrowedBy: "",
      borrowedAt: "",
    },
  });

  const isBorrowed = watch("isBorrowed");
  const imageValue = watch("image");

  useEffect(() => {
    if (!book) return;

    reset({
      status: book.status ?? BookStatus.Unread,
      image: book.image ?? null,
      isFavorite: !!book.isFavorite,
      isBorrowed: !!book.isBorrowed,
      borrowedBy: book.borrowedBy ?? "",
      borrowedAt: normalizeIsoDate(book.borrowedAt),
    });
    setCoverUri(book?.image ?? null);
  }, [book, reset]);

  const onSubmit = async (data: EditBookFormValues) => {
    try {
      const payload: any = {
        status: data.status,
        isFavorite: data.isFavorite,
        isBorrowed: data.isBorrowed,
        borrowedBy: data.isBorrowed ? data.borrowedBy.trim() || null : null,
        borrowedAt:
          data.isBorrowed && data.borrowedAt.trim()
            ? isoDateToIsoDateTime(data.borrowedAt.trim())
            : null,
      };

      if (coverUri === null) {
        payload.image = null;
      }

      await updateBook({
        id: String(bookId),
        data: payload,
      });

      if (coverUri && isLocalImage(coverUri)) {
        await uploadBookCover(String(bookId), coverUri);
      }

      Alert.alert("Succès", "Livre mis à jour.");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de modifier le livre.");
    }
  };

  if (loading && !book) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.center}>
        <Text>Impossible de charger ce livre.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="image"
        render={({ field: { value } }) => (
          <View style={styles.fieldGroup}>
            <BookCoverField
              value={coverUri}
              onTakePhoto={takePhoto}
              onPickImage={pickImageFromLibrary}
              onRemoveImage={removeImage}
              mode="edit"
            />
            {errors.image && (
              <Text style={styles.error}>{errors.image.message}</Text>
            )}
          </View>
        )}
      />
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statut</Text>

        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange } }) => (
            <View style={styles.statusList}>
              <Pressable
                style={[
                  styles.statusButton,
                  value === BookStatus.Unread && styles.statusButtonActive,
                ]}
                onPress={() => onChange(BookStatus.Unread)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    value === BookStatus.Unread &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  Non lu
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  value === BookStatus.ToRead && styles.statusButtonActive,
                ]}
                onPress={() => onChange(BookStatus.ToRead)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    value === BookStatus.ToRead &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  À lire
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  value === BookStatus.Read && styles.statusButtonActive,
                ]}
                onPress={() => onChange(BookStatus.Read)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    value === BookStatus.Read && styles.statusButtonTextActive,
                  ]}
                >
                  Lu
                </Text>
              </Pressable>
            </View>
          )}
        />

        {errors.status && (
          <Text style={styles.errorText}>{errors.status.message}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Controller
          control={control}
          name="isFavorite"
          render={({ field: { value, onChange } }) => (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Favori</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="isBorrowed"
          render={({ field: { value, onChange } }) => (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Prêté</Text>
              <Switch
                value={value}
                onValueChange={(nextValue) => {
                  onChange(nextValue);

                  if (!nextValue) {
                    setValue("borrowedBy", "");
                    setValue("borrowedAt", "");
                  }
                }}
              />
            </View>
          )}
        />
      </View>

      {isBorrowed && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de prêt</Text>

          <Text style={styles.inputLabel}>Prêté à</Text>
          <Controller
            control={control}
            name="borrowedBy"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Nom de la personne"
                style={styles.input}
              />
            )}
          />
          {errors.borrowedBy && (
            <Text style={styles.errorText}>{errors.borrowedBy.message}</Text>
          )}

          <Text style={styles.inputLabel}>Date de prêt</Text>
          <Controller
            control={control}
            name="borrowedAt"
            render={({ field: { value, onChange } }) => (
              <>
                <Pressable
                  style={styles.input}
                  onPress={() => {
                    const currentDate = isoToDate(value);

                    if (Platform.OS === "android") {
                      DateTimePickerAndroid.open({
                        value: currentDate,
                        mode: "date",
                        is24Hour: true,
                        onChange: (_, selectedDate) => {
                          if (!selectedDate) return;
                          onChange(dateToIsoOnly(selectedDate));
                        },
                      });
                    } else {
                      setShowIOSBorrowedPicker(true);
                    }
                  }}
                >
                  <Text style={{ color: value ? "#0F172A" : "#94A3B8" }}>
                    {value ? isoToFr(value) : "Sélectionner une date"}
                  </Text>
                </Pressable>

                {Platform.OS === "ios" && showIOSBorrowedPicker && (
                  <DateTimePicker
                    value={isoToDate(value)}
                    mode="date"
                    display="spinner"
                    onChange={(_, selectedDate) => {
                      if (!selectedDate) return;
                      onChange(dateToIsoOnly(selectedDate));
                      setShowIOSBorrowedPicker(false);
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.borrowedAt && (
            <Text style={styles.errorText}>{errors.borrowedAt.message}</Text>
          )}
        </View>
      )}

      <Pressable
        style={[styles.saveButton, updating && styles.saveButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={updating}
      >
        <Text style={styles.saveButtonText}>
          {updating ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusList: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },
  statusButtonActive: {
    backgroundColor: "#0F766E",
  },
  statusButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  statusButtonTextActive: {
    color: "white",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#0F172A",
  },
  inputLabel: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: -6,
  },
  saveButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  error: {
    color: "#DC2626",
    marginTop: 6,
    fontSize: 13,
  },
});
