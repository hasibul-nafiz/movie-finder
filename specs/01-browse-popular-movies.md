# Feature 1: Browse popular movies

## What the user does

Opens the app and lands on the Home tab. A grid of popular movie posters is already loading.
Tapping a poster opens the movie details screen.

## Screen

`src/app/(tabs)/index.tsx` (Home tab), title "Popular movies".

## Data

TMDB `GET /movie/popular`, called by `getPopularMovies()` in `src/services/tmdb.ts`.
The API key comes from `EXPO_PUBLIC_TMDB_API_KEY`. Only `results` is used, so the screen
shows the first page (20 movies). There is no paging.

Each movie in the grid uses the `Movie` type: `id`, `title`, `poster_path`,
`release_date`, `vote_average`.

## How it looks

`MovieGrid` draws the list. The number of columns comes from the screen width
(`Math.max(2, Math.floor(width / 120))`), so a small phone gets 2 or 3 columns and
landscape gets more. Each `MovieCard` shows the poster in a 2:3 box with rounded
corners, the title on at most two lines, and the rating.

## States

- Loading: a spinner from `StatusView`.
- Error: a short message and a Retry button. Retry increases an `attempt` counter,
  which runs the `useEffect` again.
- Empty: "No movies found."
- No poster: the card shows a plain box with the title in it instead of an image.

## Done when

Popular movies load on start, the grid reflows on rotation, a failed request shows
Retry and Retry works, and tapping a card opens the details screen.
