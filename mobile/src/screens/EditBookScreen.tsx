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

import BookCoverField from "@/components/books/BookCoverFields";
import SettingSwitchRow from "@/components/books/SettingSwitchRow";
import StatusSelector from "@/components/books/StatusSelector";
import Button from "@/components/ui/Button";

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

import { formStyles } from "@/styles/formStyles";
import { colors } from "@/styles/theme";

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
      <View style={formStyles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={formStyles.center}>
        <Text>Impossible de charger ce livre.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView
        style={formStyles.container}
        contentContainerStyle={formStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={formStyles.header}>
          <Text style={formStyles.subtitle}>
            Modifiez le statut, la couverture et les informations de prêt
          </Text>
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.sectionTitle}>Couverture</Text>

          <Controller
            control={control}
            name="image"
            render={({ field: { value } }) => (
              <View style={formStyles.fieldGroup}>
                <BookCoverField
                  value={value ?? null}
                  onTakePhoto={takePhoto}
                  onPickImage={pickImageFromLibrary}
                  onRemoveImage={removeImage}
                  mode="edit"
                />
                {errors.image && (
                  <Text style={formStyles.error}>{errors.image.message}</Text>
                )}
              </View>
            )}
          />
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
            render={({ field: { value, onChange } }) => (
              <SettingSwitchRow
                label="Ajouter aux favoris"
                hint="Pour retrouver ce livre plus rapidement"
                value={value}
                onValueChange={onChange}
              />
            )}
          />

          <View style={styles.divider} />

          <Controller
            control={control}
            name="isBorrowed"
            render={({ field: { value, onChange } }) => (
              <View style={formStyles.switchRow}>
                <View>
                  <Text style={formStyles.switchLabel}>Livre prêté</Text>
                  <Text style={formStyles.switchHint}>
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
          <View style={formStyles.card}>
            <Text style={formStyles.sectionTitle}>Informations de prêt</Text>

            <Controller
              control={control}
              name="borrowedBy"
              render={({ field: { value, onChange } }) => (
                <View style={formStyles.fieldGroup}>
                  <Text style={formStyles.label}>Prêté à</Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nom de la personne"
                    placeholderTextColor={colors.placeholder}
                    style={[
                      formStyles.input,
                      errors.borrowedBy && formStyles.inputError,
                    ]}
                  />
                  {errors.borrowedBy && (
                    <Text style={formStyles.error}>
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
                <View style={formStyles.fieldGroup}>
                  <Text style={formStyles.label}>Date de prêt</Text>

                  <Pressable
                    style={[
                      formStyles.input,
                      styles.dateInput,
                      errors.borrowedAt && formStyles.inputError,
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
                    <Text style={formStyles.error}>
                      {errors.borrowedAt.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}

        <Button
          label="Enregistrer"
          onPress={handleSubmit(onSubmit)}
          disabled={updating}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 14,
  },

  dateInput: {
    justifyContent: "center",
  },

  dateText: {
    fontSize: 15,
    color: colors.text,
  },

  datePlaceholderText: {
    color: colors.placeholder,
  },
});
