import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import MovieCard from "@/components/MovieCard";
import { spacing } from "@/constants/theme";
import { Movie } from "@/types/movie";

type Props = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: Props) {
  const { width } = useWindowDimensions();
  const columns = Math.max(2, Math.floor(width / 120));
  const gaps = spacing.small * (columns - 1);
  const cardWidth = (width - spacing.medium * 2 - gaps) / columns;

  return (
    <FlatList
      key={columns}
      data={movies}
      numColumns={columns}
      keyExtractor={(movie) => String(movie.id)}
      renderItem={({ item }) => <MovieCard movie={item} width={cardWidth} />}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.medium,
  },
  row: {
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
});
