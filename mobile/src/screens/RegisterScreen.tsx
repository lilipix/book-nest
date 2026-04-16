import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

import { RootStackParamList } from "@/navigation/types";

import FormField from "@/components/books/FormField";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/useAuth";
import { formStyles } from "@/styles/formStyles";
import { colors, spacing } from "@/styles/theme";

const RegisterSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.email("Email invalide"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&)",
      )
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
const defaultFormValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      await signUp(payload);
    } catch (error) {
      Alert.alert(
        "Inscription impossible",
        error instanceof Error ? error.message : "Erreur inconnue",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={formStyles.subtitle}>
              Gérez facilement votre bibliothèque avec BookNest.
            </Text>
          </View>
          <View style={[formStyles.card, styles.card]}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onBlur, onChange, value } }) => (
                <FormField
                  label="Prénom"
                  placeholder="Prénom"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  autoCapitalize="words"
                  returnKeyType="next"
                  textContentType="givenName"
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onBlur, onChange, value } }) => (
                <FormField
                  label="Nom"
                  placeholder="Nom"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  autoCapitalize="words"
                  returnKeyType="next"
                  textContentType="familyName"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <FormField
                  label="Email"
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  // textContentType="emailAddress"
                  returnKeyType="next"
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <FormField
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Confirmer le mot de passe"
                  placeholder="Confirmer le mot de passe"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />
              )}
            />
          </View>
          <View style={styles.actions}>
            <Button
              label={isSubmitting ? "Création..." : "Créer un compte"}
              disabled={isSubmitting}
              onPress={handleSubmit(onRegister)}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Déjà un compte ?</Text>
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate("Login")}
              >
                Se connecter
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  card: {
    gap: spacing.md,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});
