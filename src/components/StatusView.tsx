import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";

type Props = {
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onRetry: () => void;
};

export default function StatusView({ loading, error, emptyMessage, onRetry }: Props) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{emptyMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.large,
  },
  message: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
    textAlign: "center",
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.medium,
    textAlign: "center",
    marginBottom: spacing.medium,
  },
  button: {
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget * 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.large,
    borderRadius: radius.medium,
    backgroundColor: colors.accent,
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: "bold",
  },
});
