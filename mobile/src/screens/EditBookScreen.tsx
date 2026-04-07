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
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm, useWatch } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { BookStatus, BookUpdateInput } from "@/gql/graphql";

import { LibraryStackParamList } from "@/navigation/types";

import { useBook } from "@/hooks/useBook";
import { useBookCoverPicker } from "@/hooks/useBookCoverPicker";
import { useUpdateBook } from "@/hooks/useUpdateBook";

import BookCoverField from "@/components/BookCoverFields";

import {
  dateToIsoOnly,
  isoDateRegex,
  isoDateToIsoDateTime,
  isoToDate,
  isoToFr,
  normalizeIsoDate,
} from "@/utils/dates";
import { isLocalImage } from "@/utils/image";

import { uploadBookCover } from "@/services/uploadBookCover";

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

  const [showIOSBorrowedPicker, setShowIOSBorrowedPicker] = useState(false);

  const { book, loading, error } = useBook(String(bookId));
  const { takePhoto, pickImageFromLibrary, removeImage } = useBookCoverPicker({
    onChange: (uri) => {
      setValue("image", uri ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });
  const { updateBook, loading: updating } = useUpdateBook();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditBookFormValues>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      status: BookStatus.ToRead,
      image: undefined,
      isFavorite: false,
      isBorrowed: false,
      borrowedBy: "",
      borrowedAt: "",
    },
  });

  const isBorrowed = useWatch({ control, name: "isBorrowed" });

  useEffect(() => {
    if (!book) return;

    reset({
      status: book.status ?? BookStatus.Unread,
      image: book.image ?? undefined,
      isFavorite: !!book.isFavorite,
      isBorrowed: !!book.isBorrowed,
      borrowedBy: book.borrowedBy ?? "",
      borrowedAt: normalizeIsoDate(book.borrowedAt),
    });
  }, [book, reset]);

  const onSubmit = async (data: EditBookFormValues) => {
    try {
      const payload: BookUpdateInput = {
        status: data.status,
        isFavorite: data.isFavorite,
        isBorrowed: data.isBorrowed,
        borrowedBy: data.isBorrowed ? data.borrowedBy.trim() || null : null,
        borrowedAt:
          data.isBorrowed && data.borrowedAt.trim()
            ? isoDateToIsoDateTime(data.borrowedAt.trim())
            : null,
      };

      if (data.image === null || data.image === "") {
        payload.image = null;
      }

      await updateBook({
        id: String(bookId),
        data: payload,
      });

      if (data.image && isLocalImage(data.image)) {
        await uploadBookCover(String(bookId), data.image);
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
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Modifie le statut, la couverture et les informations de prêt
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Couverture</Text>

          <Controller
            control={control}
            name="image"
            render={({ field: { value } }) => (
              <View style={styles.fieldGroup}>
                <BookCoverField
                  value={value ?? null}
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

          {errors.status && (
            <Text style={styles.error}>{errors.status.message}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Options</Text>

          <Controller
            control={control}
            name="isFavorite"
            render={({ field: { value, onChange } }) => (
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

          <View style={styles.divider} />

          <Controller
            control={control}
            name="isBorrowed"
            render={({ field: { value, onChange } }) => (
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Livre prêté</Text>
                  <Text style={styles.switchHint}>
                    Active cette option si le livre a été emprunté
                  </Text>
                </View>
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

            <Controller
              control={control}
              name="borrowedBy"
              render={({ field: { value, onChange } }) => (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Prêté à</Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nom de la personne"
                    placeholderTextColor="#9CA3AF"
                    style={[
                      styles.input,
                      errors.borrowedBy && styles.inputError,
                    ]}
                  />
                  {errors.borrowedBy && (
                    <Text style={styles.error}>
                      {errors.borrowedBy.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="borrowedAt"
              render={({ field: { value, onChange } }) => (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date de prêt</Text>

                  <Pressable
                    style={[
                      styles.input,
                      styles.dateInput,
                      errors.borrowedAt && styles.inputError,
                    ]}
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
                    <Text
                      style={[
                        styles.dateText,
                        !value && styles.datePlaceholderText,
                      ]}
                    >
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

                  {errors.borrowedAt && (
                    <Text style={styles.error}>
                      {errors.borrowedAt.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            updating && styles.primaryButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={updating}
        >
          {updating ? (
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    marginBottom: 20,
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
    maxWidth: 220,
  },

  switchHint: {
    fontSize: 13,
    color: "#6B7280",
    maxWidth: 220,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  dateInput: {
    justifyContent: "center",
  },

  dateText: {
    fontSize: 15,
    color: "#111827",
  },

  datePlaceholderText: {
    color: "#9CA3AF",
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
