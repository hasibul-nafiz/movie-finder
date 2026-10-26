import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieGrid from "@/components/MovieGrid";
import StatusView from "@/components/StatusView";
import { getWatchlist } from "@/db/watchlist";
import { colors, fontSizes, spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

export default function WatchlistScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setAttempt(attempt + 1);
  }

  // useFocusEffect needs useCallback, or it would run again on every render
  useFocusEffect(
    useCallback(() => {
      setAttempt((current) => current + 1);
    }, [])
  );

  useEffect(() => {
    async function loadMovies() {
      try {
        setMovies(await getWatchlist());
        setError(null);
      } catch {
        setError("Could not load your watchlist. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [attempt]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.heading}>Watchlist</Text>
      {loading || error || movies.length === 0 ? (
        <StatusView
          loading={loading}
          error={error}
          emptyMessage="Your watchlist is empty"
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
