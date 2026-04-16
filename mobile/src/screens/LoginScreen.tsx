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
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

import FormField from "@/components/books/FormField";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/useAuth";
import { formStyles } from "@/styles/formStyles";
import { colors, spacing } from "@/styles/theme";

const LoginSchema = z
  .object({
    email: z.email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
  })
  .refine((data) => data.password.length >= 8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  });

export type LoginFormValues = z.infer<typeof LoginSchema>;
const defaultFormValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onLogin = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      Alert.alert(
        "Connexion impossible",
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
              Connectez-vous pour continuer.
            </Text>
          </View>
          <View style={[formStyles.card, styles.card]}>
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

            <View style={styles.actions}>
              <Button
                label={isSubmitting ? "Connexion..." : "Se connecter"}
                disabled={isSubmitting}
                onPress={handleSubmit(onLogin)}
              />
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
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    justifyContent: "center",
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
});
