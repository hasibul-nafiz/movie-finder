import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusView from "@/components/StatusView";
import Toast from "@/components/Toast";
import { addMovie, isSaved, removeMovie } from "@/db/watchlist";
import { getMovieDetails, getPosterUrl } from "@/services/tmdb";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";
import { MovieDetails } from "@/types/movie";

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return "Runtime unknown";
  }
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
}

export default function MovieDetailsScreen() {
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
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
        setSaved(await isSaved(Number(id)));
      } catch {
        setError(
          "Could not load this movie. Check your connection and try again.",
        );
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

  const details = movie;

  async function handleSavePress() {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await removeMovie(details.id);
        setToast("Removed from watchlist");
      } else {
        await addMovie(details);
        setToast("Added to watchlist");
      }
      setSaved(!saved);
    } catch {
      setError("Could not update your watchlist. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSharePress() {
    try {
      await Share.share({
        message: `${details.title} - https://www.themoviedb.org/movie/${details.id}`,
      });
    } catch {
      setError("Could not share this movie. Please try again.");
    }
  }

  const posterWidth = width > height ? "30%" : "70%";
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Unknown year";

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={[styles.poster, { width: posterWidth }]}
          />
        ) : (
          <View
            style={[styles.poster, styles.noPoster, { width: posterWidth }]}
          >
            <Text style={styles.noPosterText}>{movie.title}</Text>
          </View>
        )}
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.facts}>
          <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.info}>{formatRuntime(movie.runtime)}</Text>
          <Text style={styles.info}>{year}</Text>
        </View>
        <View style={styles.genres}>
          {movie.genres.map((genre) => (
            <Text key={genre.id} style={styles.genre}>
              {genre.name}
            </Text>
          ))}
        </View>
        <View style={styles.buttons}>
          <Pressable
            onPress={handleSavePress}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>
                {saved ? "Remove from watchlist" : "Save to watchlist"}
              </Text>
            )}
          </Pressable>
          <Pressable
            onPress={handleSharePress}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Share</Text>
          </Pressable>
        </View>
        <Text style={styles.overview}>
          {movie.overview || "No overview available."}
        </Text>
      </ScrollView>
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
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
    textAlign: "center",
  },
  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.medium,
    marginTop: spacing.small,
  },
  info: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
  },
  rating: {
    color: colors.accent,
    fontSize: fontSizes.large,
    fontWeight: "bold",
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
  buttons: {
    flexDirection: "row",
    gap: spacing.small,
    marginTop: spacing.medium,
  },
  button: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.small,
    borderRadius: radius.medium,
    backgroundColor: colors.accent,
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  overview: {
    color: colors.text,
    fontSize: fontSizes.medium,
    lineHeight: sizes.bodyLineHeight,
    marginTop: spacing.medium,
  },
});
