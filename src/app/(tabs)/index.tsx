import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieGrid from "@/components/MovieGrid";
import StatusView from "@/components/StatusView";
import { getPopularMovies } from "@/services/tmdb";
import { colors, fontSizes, spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setAttempt(attempt + 1);
  }

  useEffect(() => {
    async function loadMovies() {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch {
        setError("Could not load movies. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [attempt]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.heading}>Popular movies</Text>
      {loading || error || movies.length === 0 ? (
        <StatusView
          loading={loading}
          error={error}
          emptyMessage="No movies found."
          onRetry={handleRetry}
        />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    color: colors.text,
    fontSize: fontSizes.title,
    fontWeight: "bold",
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium,
  },
});
