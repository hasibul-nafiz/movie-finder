import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { getBackdropUrl, getPosterUrl } from "@/services/tmdb";
import { colors, fontSizes, radius, sizes, spacing } from "@/constants/theme";
import { MovieDetails } from "@/types/movie";

type Props = {
  movie: MovieDetails;
};

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return "Runtime unknown";
  }
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
}

export default function DetailsHeader({ movie }: Props) {
  const { width, height } = useWindowDimensions();
  const posterWidth = Math.min(width, height) * 0.35;
  const backdropHeight = Math.min((width * 9) / 16, sizes.backdropMaxHeight);
  const posterUrl = getPosterUrl(movie.poster_path);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Unknown year";

  return (
    <View>
      {backdropUrl ? (
        <Image
          source={{ uri: backdropUrl }}
          style={[styles.backdrop, { height: backdropHeight }]}
        />
      ) : (
        <View style={[styles.backdrop, { height: backdropHeight }]} />
      )}
      <View style={styles.row}>
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
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={4}>
            {movie.title}
          </Text>
          <Text style={styles.meta}>
            {year} · {formatRuntime(movie.runtime)}
          </Text>
          <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.meta}>{movie.vote_count} votes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    backgroundColor: colors.card,
  },
  row: {
    flexDirection: "row",
    gap: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  poster: {
    aspectRatio: 2 / 3,
    marginTop: -spacing.large * 2,
    borderRadius: radius.medium,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.background,
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
  info: {
    flex: 1,
    paddingTop: spacing.small,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.large,
    fontWeight: "bold",
  },
  meta: {
    color: colors.mutedText,
    fontSize: fontSizes.small,
    marginTop: spacing.small,
  },
  rating: {
    color: colors.accent,
    fontSize: fontSizes.title,
    fontWeight: "bold",
    marginTop: spacing.small,
  },
});
