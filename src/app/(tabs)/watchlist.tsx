import { Text, View, StyleSheet } from "react-native";
import { colors, fontSizes } from "@/constants/theme";

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.title,
  },
});
