import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";
import { MovieDetails } from "@/types/movie";

type Props = {
  movie: MovieDetails;
};

function formatMoney(amount: number) {
  if (amount >= 1000000) {
    return `$${Math.round(amount / 1000000)}M`;
  }
  return `$${amount}`;
}

export default function DetailsInfo({ movie }: Props) {
  const companies = movie.production_companies.map((company) => company.name);

  const rows = [
    { label: "Status", value: movie.status },
    { label: "Language", value: movie.original_language.toUpperCase() },
    {
      label: "Budget",
      value: movie.budget > 0 ? formatMoney(movie.budget) : "",
    },
    {
      label: "Revenue",
      value: movie.revenue > 0 ? formatMoney(movie.revenue) : "",
    },
    { label: "Production", value: companies.join(", ") },
  ].filter((row) => row.value !== "");

  if (rows.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={styles.heading}>Details</Text>
      <View style={styles.card}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: spacing.small,
  },
  card: {
    padding: spacing.medium,
    gap: spacing.medium,
    borderRadius: radius.medium,
    backgroundColor: colors.card,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  label: {
    color: colors.mutedText,
    fontSize: fontSizes.medium,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.medium,
    textAlign: "right",
  },
});
