import { StyleSheet, Switch, Text, View } from "react-native";

import { formStyles } from "@/styles/formStyles";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hint?: string;
};

export default function SettingSwitchRow({
  label,
  value,
  onValueChange,
  hint,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>

      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textContainer: {
    maxWidth: "70%",
  },

  label: formStyles.switchLabel,

  hint: formStyles.switchHint,
});
