import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

type Props = {
  message: string | null;
  onHide: () => void;
};

export default function Toast({ message, onHide }: Props) {
  useEffect(() => {
    if (message === null) {
      return;
    }
    const timer = setTimeout(onHide, 2000);
    return () => clearTimeout(timer);
  }, [message, onHide]);

  if (message === null) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: spacing.large,
    right: spacing.large,
    bottom: spacing.large,
    alignItems: "center",
    padding: spacing.medium,
    borderRadius: radius.medium,
    backgroundColor: colors.toast,
  },
  text: {
    color: colors.text,
    fontSize: fontSizes.medium,
  },
});
