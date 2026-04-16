import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { formStyles } from "@/styles/formStyles";
import { colors } from "@/styles/theme";

type FormFieldProps = {
  label: string;
  error?: string;
} & TextInputProps;

export default function FormField({
  label,
  error,
  style,
  onFocus,
  onBlur,
  secureTextEntry,
  ...textInputProps
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [secure, setSecure] = useState(!!secureTextEntry);

  return (
    <View style={formStyles.fieldGroup}>
      <Text style={formStyles.label}>{label}</Text>

      <View style={formStyles.inputWrapper}>
        <TextInput
          {...textInputProps}
          secureTextEntry={secureTextEntry ? secure : false}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.placeholder}
          style={[
            formStyles.input,
            isFocused && formStyles.inputFocused,
            !!error && formStyles.inputError,
            secureTextEntry && formStyles.inputWithIcon,
            style,
          ]}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setSecure((prev) => !prev)}
            style={formStyles.eyeButton}
            hitSlop={10}
          >
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </Pressable>
        )}
      </View>

      {!!error && <Text style={formStyles.error}>{error}</Text>}
    </View>
  );
}
