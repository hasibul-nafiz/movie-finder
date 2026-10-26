import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GenreChips from "@/components/GenreChips";
import MovieGrid from "@/components/MovieGrid";
import StatusView from "@/components/StatusView";
import { getMoviesByGenre, searchMovies } from "@/services/tmdb";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

export default function SearchScreen() {
  const [text, setText] = useState("");
  const [genreId, setGenreId] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  async function loadMovies(request: Promise<Movie[]>) {
    setStarted(true);
    setLoading(true);
    setError(null);
    try {
      setMovies(await request);
    } catch {
      setError("Could not load movies. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetResults() {
    setMovies([]);
    setError(null);
    setStarted(false);
  }

  function handleSearch() {
    const title = text.trim();
    if (title === "") {
      return;
    }
    setGenreId(null);
    loadMovies(searchMovies(title));
  }

  function handleGenrePress(id: number) {
    if (id === genreId) {
      setGenreId(null);
      resetResults();
      return;
    }
    setText("");
    setGenreId(id);
    loadMovies(getMoviesByGenre(id));
  }

  function handleClearPress() {
    setText("");
    if (genreId === null) {
      resetResults();
    }
  }

  function handleRetry() {
    if (genreId !== null) {
      loadMovies(getMoviesByGenre(genreId));
    } else {
      loadMovies(searchMovies(text.trim()));
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.heading}>Search</Text>
      <View style={styles.searchBox}>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSearch}
          placeholder="Search movies"
          placeholderTextColor={colors.mutedText}
          returnKeyType="search"
          style={styles.input}
        />
        {text !== "" && (
          <Pressable
            onPress={handleClearPress}
            style={({ pressed }) => [styles.clearButton, pressed && styles.clearPressed]}
          >
            <Text style={styles.clearText}>X</Text>
          </Pressable>
        )}
      </View>
      <GenreChips selectedId={genreId} onPress={handleGenrePress} />
      {loading || error || movies.length === 0 ? (
        <StatusView
          loading={loading}
          error={error}
          emptyMessage={
            started ? "No movies found" : "Type a movie name or pick a genre"
          }
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.medium,
    borderRadius: radius.medium,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.medium,
    color: colors.text,
    fontSize: fontSizes.medium,
  },
  clearButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  clearPressed: {
    opacity: 0.5,
  },
  clearText: {
    color: colors.mutedText,
    fontSize: fontSizes.large,
  },
});
