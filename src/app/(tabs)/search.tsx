import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GenreChips from "@/components/GenreChips";
import MovieGrid from "@/components/MovieGrid";
import StatusView from "@/components/StatusView";
import {
  getMoviesByGenre,
  getPopularMovies,
  searchMovies,
} from "@/services/tmdb";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

export default function SearchScreen() {
  const [text, setText] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [genreId, setGenreId] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadMovies() {
      try {
        let results: Movie[];
        if (searchedText !== "") {
          results = await searchMovies(searchedText);
        } else if (genreId !== null) {
          results = await getMoviesByGenre(genreId);
        } else {
          results = await getPopularMovies();
        }
        if (!cancelled) {
          setMovies(results);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not load movies. Check your connection and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [searchedText, genreId, attempt]);

  function startLoading() {
    setLoading(true);
    setError(null);
    setAttempt((current) => current + 1);
  }

  function handleSearch() {
    const title = text.trim();
    if (title === "") {
      return;
    }
    startLoading();
    setGenreId(null);
    setSearchedText(title);
  }

  function handlePopularPress() {
    startLoading();
    setText("");
    setSearchedText("");
    setGenreId(null);
  }

  function handleGenrePress(id: number) {
    if (id === genreId) {
      handlePopularPress();
      return;
    }
    startLoading();
    setText("");
    setSearchedText("");
    setGenreId(id);
  }

  function handleClearPress() {
    setText("");
    if (searchedText !== "") {
      handlePopularPress();
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
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearPressed,
            ]}
          >
            <Text style={styles.clearText}>X</Text>
          </Pressable>
        )}
      </View>
      <GenreChips
        popularSelected={genreId === null && searchedText === ""}
        selectedId={genreId}
        onPopularPress={handlePopularPress}
        onPress={handleGenrePress}
      />
      {loading || error || movies.length === 0 ? (
        <StatusView
          loading={loading}
          error={error}
          emptyMessage="No movies found"
          onRetry={startLoading}
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
