# Feature 3: Filter movies by genre

## What the user does

On the Search tab, taps a genre chip (Action, Comedy, Drama, Horror, Romance, Sci-Fi,
Animation, Thriller). The grid shows movies of that genre. Tapping the same chip again,
or the "Popular" chip, goes back to the popular list.

## Screen and component

`src/app/(tabs)/search.tsx` with `src/components/GenreChips.tsx`.

## Data

TMDB `GET /discover/movie?with_genres={id}`, called by `getMoviesByGenre(genreId)` in
`src/services/tmdb.ts`.

The genre list is fixed in `src/constants/genres.ts` (eight genres with their real TMDB
ids). The ids are TMDB's own, so they cannot be renumbered. This is not an invented list
of movies: only the genre names and ids are local, every movie still comes from the API.

## Behaviour

- Only one genre is selected at a time; `genreId` is a single number or `null`.
- Picking a genre clears the search text, so a genre and a title search never mix.
- The chips wrap onto more rows on a narrow screen.
- The selected chip is filled with the accent color; every chip is at least 44 dp high.

## States

Same as search: spinner while loading, message and Retry on failure, "No movies found"
when a genre comes back empty.

## Done when

Each chip loads that genre, the selected chip is visibly selected, tapping it again
returns to popular, and the chips stay readable on a 360 dp wide phone.
