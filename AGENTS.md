# Movie Finder (Android only)

University project. The user finds movies and keeps a watchlist.
Keep everything simple. A beginner must be able to read and explain every file.

## Features (only these 6, nothing else)

1. Browse popular movies: TMDB `/movie/popular`
2. Search movies by title: TMDB `/search/movie`
3. Filter by genre: TMDB `/discover/movie?with_genres=`
4. View movie details: TMDB `/movie/{id}`
5. Save to a watchlist: SQLite on the phone
6. Share a movie: native share sheet (`Share` from `react-native`)

Do not add other features, screens, or packages without asking.

## Platform and stack

- Android only. `app.json` has `"platforms": ["android"]`. No iOS or web code.
- Expo + React Native + TypeScript, Expo Router (tabs), `expo-sqlite`, plain `fetch`, `StyleSheet`.
- Not allowed: Appwrite, NativeWind, axios, Redux, Zustand, Context, React Query.
- TMDB v3 API key comes from `EXPO_PUBLIC_TMDB_API_KEY` in `.env`. Never hard-code the key.

## Run from the command line

```
npm install
npx expo start --android
```

Needs an Android emulator or a phone with USB debugging and Expo Go. `adb devices` must list it.

## Folder structure

This Expo SDK keeps all code inside `src/`. Every folder below lives in `src/` (example: `src/app/_layout.tsx`, `src/components/MovieCard.tsx`). `specs/`, `README.md` and `.env` stay in the project root. Imports use the alias from `tsconfig.json` (usually `@/`); if there is none, use relative imports.

```
app/
  _layout.tsx            root stack (tabs + movie details)
  (tabs)/
    _layout.tsx          bottom tabs: Home, Search, Watchlist
    index.tsx            Home (popular movies)
    search.tsx           Search + genre chips
    watchlist.tsx        saved movies
  movie/[id].tsx         movie details, Save and Share buttons
components/
  MovieCard.tsx          one poster card
  MovieGrid.tsx          responsive grid of MovieCard
  GenreChips.tsx         row of genre buttons
  StatusView.tsx         loading, error + Retry, empty message
services/tmdb.ts         all API calls
db/watchlist.ts          all SQLite code
constants/theme.ts       colors, spacing, radius, font sizes
constants/genres.ts      fixed genre list (name + TMDB id)
types/movie.ts           Movie, MovieDetails, Genre
specs/product.md         assignment spec
README.md                how to run
```

## Code style (very important)

Write code like a first-year student who knows React well: plain, short, readable.

- `function` components and functions. `useState` and `useEffect` only (plus `useFocusEffect` for the watchlist).
- No `useMemo`, `useCallback`, `React.memo`, custom hooks, reducers, generics, enums, or classes.
- No `any`. Use the types from `types/movie.ts`.
- Clear, ordinary names: `movies`, `loading`, `error`, `getPopularMovies`, `handleSavePress`.
- Each file does one job and stays under about 150 lines. Split a screen only when it gets long.
- Same patterns everywhere: every screen has `loading`, `error`, and `movies` state and loads data the same way.
- Every `fetch` checks `response.ok` and sits in `try/catch`. Errors show a short message and a Retry button.
- Handle empty data: missing poster (show a plain box with the title), missing runtime, empty lists.
- UI text in simple English.

### Comments

- Write few comments. Only explain something that is not obvious (a TMDB quirk, why a number is used).
- One short plain line. No banners, no section dividers, no emoji, no JSDoc blocks.
- Never write a comment that repeats the code (`// set loading to true`).
- No `console.log`, no `TODO`, no commented-out code left behind.

## UI rules (beautiful and responsive)

- Dark theme, warm orange accent. All colors, spacing, radius, and font sizes come from `constants/theme.ts`. No color codes inside screens.
- Never use fixed pixel widths for layout. Use `flex`, percentages, and `useWindowDimensions`.
- Grid columns come from the screen width: `columns = Math.max(2, Math.floor(width / 120))`. Card width = (width - side padding - gaps) / columns. When `columns` changes, give the `FlatList` a `key={columns}`.
- Posters use a 2:3 ratio with rounded corners. Long titles use `numberOfLines={2}`.
- Touch targets at least 44 dp. Buttons use `Pressable` with a visible pressed state.
- Respect safe areas (status bar and navigation bar). Dark status bar content set to light.
- Must look right on a small phone (360 dp wide), a large phone (412 dp wide), and in landscape.

## Quality gate (no errors allowed)

After every change, run these and fix everything before finishing:

```
npx tsc --noEmit
npx expo lint
npx expo install --check
npx expo-doctor
```

Then run `npx expo start --android` and check the changed screen works with no red error screen and no yellow warnings.
Remove unused imports, variables, and files.

## How to work

- Do one task at a time. Make small, targeted edits to existing files. Do not rewrite files that already work.
- Do not touch files unrelated to the task.
- Ask before adding any new package.
- Use the installed `expo-sqlite` version's current API. Check its docs instead of guessing.

## Student note

You must understand and be able to explain every line you submit. Follow your course's rules on using AI tools.