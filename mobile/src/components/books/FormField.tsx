import { Text, TextInput, View } from "react-native";

import { formStyles } from "@/styles/formStyles";
import { colors } from "@/styles/theme";

type FormFieldProps = {
  label: string;
  error?: string;
} & React.ComponentProps<typeof TextInput>;
export default function FormField({
  label,
  error,
  style,
  ...textInputProps
}: FormFieldProps) {
  return (
    <View style={formStyles.fieldGroup}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        {...textInputProps}
        placeholderTextColor={colors.placeholder}
        style={[formStyles.input, error && formStyles.inputError, style]}
      />
      {!!error && <Text style={formStyles.error}>{error}</Text>}
    </View>
  );
}
