# Feature 5: Save to a watchlist (SQLite)

## What the user does

On the details screen, taps "Save to watchlist". A small toast says "Added to watchlist"
and the button turns into "Remove from watchlist". The Watchlist tab shows every saved
movie, as the same poster grid. Saved movies survive closing the app.

## Where it lives

- `src/db/watchlist.ts` holds all SQLite code.
- `src/app/(tabs)/watchlist.tsx` is the Watchlist tab.
- The Save button is in `src/app/movie/[id].tsx`.

## Database

`expo-sqlite`, database file `movies.db`, opened with `openDatabaseAsync`. One table,
created with `CREATE TABLE IF NOT EXISTS` the first time the database is opened:

| Column | Type | Meaning |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY | TMDB movie id |
| title | TEXT NOT NULL | Movie title |
| poster_path | TEXT | Poster path from TMDB |
| vote_average | REAL | Rating |
| release_date | TEXT | Release date |

The columns are exactly the fields a `MovieCard` needs, so a saved row can be drawn in
the grid without calling the API again. The TMDB id is the primary key, so the same movie
cannot be saved twice.

## Functions

- `addMovie(movie)` — `INSERT OR REPLACE`, so saving twice is harmless.
- `removeMovie(id)` — `DELETE` by id.
- `getWatchlist()` — `SELECT * ... ORDER BY rowid DESC`, newest first.
- `isSaved(id)` — used on the details screen to decide which label the button shows.

All of them use `?` placeholders, never string building.

## Reloading the tab

The Watchlist tab reloads on every focus with `useFocusEffect`, because a movie can be
saved or removed on another screen. `useFocusEffect` needs `useCallback`, or it would run
again on every render.

## States

Loading spinner, error message with Retry, and "Your watchlist is empty" for a new user.
While the save is running the button shows a spinner and ignores extra taps.

## Done when

Save adds the movie and it appears in the Watchlist tab, Remove takes it out, the list is
still there after the app is closed and reopened, and an empty watchlist shows the message.
