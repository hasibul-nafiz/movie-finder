# Feature 2: Search movies by title

## What the user does

Opens the Search tab, types a movie title, and presses the search key on the keyboard.
The grid below shows the matching movies. An X button clears the field.

## Screen

`src/app/(tabs)/search.tsx` (Search tab).

## Data

TMDB `GET /search/movie?query=`, called by `searchMovies(query)` in
`src/services/tmdb.ts`. The text is trimmed first, and an empty search does nothing.
When nothing has been searched and no genre is picked, the screen shows the popular
list instead, so the tab is never empty.

## State

The screen keeps `text` (what is in the input) and `searchedText` (what was actually
searched) apart, so typing does not fire a request on every letter. One `useEffect`
watches `searchedText`, `genreId` and `attempt`, and chooses which request to send.
A `cancelled` flag in the effect cleanup stops a slow answer from overwriting a newer one.

Starting a search clears the selected genre: title search and genre filter are never
combined.

## States

- Loading: spinner from `StatusView`.
- Error: short message and Retry.
- Empty: "No movies found" (a title with no results).

## Done when

A search shows matching movies, a search with no results shows the empty message,
clearing the field brings the popular list back, and a failed request shows Retry.
