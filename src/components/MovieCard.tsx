import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { getPosterUrl } from "@/services/tmdb";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

type Props = {
  movie: Movie;
  width: number;
};

export default function MovieCard({ movie, width }: Props) {
  const router = useRouter();
  const posterUrl = getPosterUrl(movie.poster_path);

  function handlePress() {
    router.push(`/movie/${movie.id}`);
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>{movie.title}</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: radius.medium,
    backgroundColor: colors.card,
  },
  noPoster: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
  },
  noPosterText: {
    color: colors.mutedText,
    fontSize: fontSizes.small,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.small,
    marginTop: spacing.small,
  },
  rating: {
    color: colors.accent,
    fontSize: fontSizes.small,
    marginTop: 2,
  },
});
