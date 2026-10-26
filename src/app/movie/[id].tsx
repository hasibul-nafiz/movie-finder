import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import StatusView from "@/components/StatusView";
import { getMovieDetails, getPosterUrl } from "@/services/tmdb";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";
import { MovieDetails } from "@/types/movie";

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return "Runtime unknown";
  }
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setAttempt(attempt + 1);
  }

  useEffect(() => {
    async function loadMovie() {
      try {
        setMovie(await getMovieDetails(Number(id)));
      } catch {
        setError("Could not load this movie. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id, attempt]);

  if (loading || error || movie === null) {
    return (
      <View style={styles.container}>
        <StatusView
          loading={loading}
          error={error}
          emptyMessage="Movie not found."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown year";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>{movie.title}</Text>
        </View>
      )}
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.info}>
        {year} · {formatRuntime(movie.runtime)}
      </Text>
      <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
      <View style={styles.genres}>
        {movie.genres.map((genre) => (
          <Text key={genre.id} style={styles.genre}>
            {genre.name}
          </Text>
        ))}
      </View>
      <Text style={styles.overview}>
        {movie.overview || "No overview available."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.medium,
  },
  poster: {
    width: "60%",
    aspectRatio: 2 / 3,
    alignSelf: "center",
    borderRadius: radius.medium,
    backgroundColor: colors.card,
  },
  noPoster: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.medium,
  },
  noPosterText: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.title,
    fontWeight: "bold",
    marginTop: spacing.medium,
  },
  info: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
    marginTop: spacing.small,
  },
  rating: {
    color: colors.accent,
    fontSize: fontSizes.large,
    marginTop: spacing.small,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.small,
    marginTop: spacing.medium,
  },
  genre: {
    color: colors.text,
    fontSize: fontSizes.small,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: radius.large,
    backgroundColor: colors.card,
  },
  overview: {
    color: colors.text,
    fontSize: fontSizes.medium,
    lineHeight: 24,
    marginTop: spacing.medium,
  },
});
