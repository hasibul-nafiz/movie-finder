import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { genres } from "@/constants/genres";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";

type Props = {
  selectedId: number | null;
  onPress: (id: number) => void;
};

export default function GenreChips({ selectedId, onPress }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.content}
    >
      {genres.map((genre) => {
        const selected = genre.id === selectedId;
        return (
          <Pressable
            key={genre.id}
            onPress={() => onPress(genre.id)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {genre.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: spacing.medium,
    gap: spacing.small,
  },
  chip: {
    minHeight: sizes.touchTarget,
    justifyContent: "center",
    paddingHorizontal: spacing.medium,
    borderRadius: radius.large,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.accent,
  },
  chipPressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.text,
    fontSize: fontSizes.medium,
  },
  textSelected: {
    color: colors.background,
    fontWeight: "bold",
  },
});
