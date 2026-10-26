import { Text, View, StyleSheet } from "react-native";
import { colors, fontSizes } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Movies</Text>
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
