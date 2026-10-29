# Feature 4: View movie details

## What the user does

Taps any poster. A details screen opens with the backdrop image, the poster, the title,
the tagline, the rating and vote count, the genres, the overview, and an info card.
Two buttons sit under the genres: Save to watchlist and Share.

## Screen

`src/app/movie/[id].tsx`, with `DetailsHeader` (backdrop, poster, title, rating) and
`DetailsInfo` (the info card). It is a stack screen, not a tab, so it has a back arrow.

## Data

TMDB `GET /movie/{id}`, called by `getMovieDetails(id)` in `src/services/tmdb.ts`.
The id comes from the route with `useLocalSearchParams`, as a string, so it is converted
with `Number(id)`.

Fields used (`MovieDetails` type): `title`, `overview`, `poster_path`, `backdrop_path`,
`tagline`, `status`, `original_language`, `release_date`, `vote_average`, `vote_count`,
`runtime`, `budget`, `revenue`, `genres`, `production_companies`.

## Empty and missing data

TMDB leaves fields empty instead of removing them, so the screen checks before drawing:
`tagline` can be `""` (hidden), `runtime` can be `null`, `budget` and `revenue` can be `0`,
`overview` can be `""` (shows "No overview available."), and both images can be `null`.

## States

Loading spinner, error message with Retry, and "Movie not found." if there is no movie.
The whole screen scrolls, so long overviews work in landscape.

## Done when

Details load for any movie, a movie with no backdrop or no runtime still looks right,
the back arrow returns to the previous tab, and a failed request shows Retry.
