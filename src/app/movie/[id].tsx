import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsHeader from "@/components/DetailsHeader";
import DetailsInfo from "@/components/DetailsInfo";
import StatusView from "@/components/StatusView";
import Toast from "@/components/Toast";
import { addMovie, isSaved, removeMovie } from "@/db/watchlist";
import { getMovieDetails } from "@/services/tmdb";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";
import { MovieDetails } from "@/types/movie";

export default function MovieDetailsScreen() {
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

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <DetailsHeader movie={movie} />
        <View style={styles.sections}>
          {movie.tagline !== "" && (
            <Text style={styles.tagline}>{movie.tagline}</Text>
          )}
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
                styles.shareButton,
                pressed && styles.shareButtonPressed,
              ]}
            >
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </View>
          <View>
            <Text style={styles.heading}>Overview</Text>
            <Text style={styles.overview}>
              {movie.overview || "No overview available."}
            </Text>
          </View>
          <DetailsInfo movie={movie} />
        </View>
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
    paddingBottom: spacing.large,
  },
  sections: {
    gap: spacing.large,
    padding: spacing.medium,
  },
  tagline: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
    fontStyle: "italic",
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.small,
  },
  genre: {
    color: colors.accent,
    fontSize: fontSizes.small,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.small,
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
  shareButton: {
    flex: 0.6,
    backgroundColor: colors.card,
  },
  shareButtonPressed: {
    opacity: 0.7,
  },
  shareText: {
    color: colors.text,
    fontSize: fontSizes.medium,
    fontWeight: "bold",
  },
  heading: {
    color: colors.text,
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: spacing.small,
  },
  overview: {
    color: colors.text,
    fontSize: fontSizes.medium,
    lineHeight: sizes.bodyLineHeight,
  },
});
