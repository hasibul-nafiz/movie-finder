# Explanation

Three questions about how this project was built.

## 1. How did you work with the agent?

I wrote the rules first. `AGENTS.md` in the repo root is what the agent reads before it
touches anything: Android only, six features and no more, Expo + React Native +
TypeScript, `expo-sqlite`, plain `fetch`, `StyleSheet`, no extra packages without asking,
and a code style section that says to write like a first-year student — `function`
components, `useState` and `useEffect` only, no `useMemo`, no `useCallback`, no `any`, no
custom hooks, files under about 150 lines, few comments. There is also a quality gate:
after every change the agent runs `npx tsc --noEmit`, `npx expo lint`,
`npx expo install --check` and `npx expo-doctor` and fixes everything before it stops.

Then I worked one task at a time, one feature per chat and per branch. The git history
shows it: `feature/tmdb-service`, `feature/navigation`, `feature/watchlist-db`,
`feature/watchlist-screen`, `feature/share-movie`, `feature/ui-polish`,
`feature/details-redesign`. Every step was a small commit with a message that says what
it did. Nothing was squashed and nothing was
force-pushed, so the whole history is still there.

The full chat of one of those tasks is in [chat-history/](../chat-history/).

## 2. What did you have to correct, and what did you change in your instructions?

The main thing I had to push back on was the agent doing too much. Left alone it adds
packages, extra screens and clever abstractions, so `AGENTS.md` got a hard list of six
features and a list of things that are not allowed — Appwrite, NativeWind, axios, Redux,
Zustand, Context, React Query — plus "ask before adding any new package" and "do not
rewrite files that already work".

The second thing was code I could not explain. The first versions used patterns I had not
learned yet, so I added the style rules that ban `useMemo`, `useCallback`, generics,
reducers and classes. The one exception is in
[src/app/(tabs)/watchlist.tsx](../src/app/(tabs)/watchlist.tsx), where `useFocusEffect`
really does need `useCallback` or it runs again on every render — so that line has a
one-line comment saying why, which is the only kind of comment the rules allow.

The third thing was checking the agent's work myself. The agent often says that the
checks pass but that it did not open the screen. That is why the quality gate ends with
running the app and checking the screen that changed, and why the app has to start from
the Expo Go QR code and not only in the emulator.

## 3. Explain one part of the code in your own words.

The responsive grid in [src/components/MovieGrid.tsx](../src/components/MovieGrid.tsx).

```tsx
const { width: windowWidth } = useWindowDimensions();
const insets = useSafeAreaInsets();
const width = windowWidth - insets.left - insets.right;
const columns = Math.max(2, Math.floor(width / 120));
const gaps = spacing.small * (columns - 1);
const cardWidth = (width - spacing.medium * 2 - gaps) / columns;
```

`useWindowDimensions` gives the current window width and updates when the phone rotates.
In landscape the system bars eat space on the sides, so the safe-area insets are
subtracted first; `width` is the space I can really draw in.

A poster should be about 120 dp wide, so `Math.floor(width / 120)` is how many fit, and
`Math.max(2, ...)` keeps at least two columns on a narrow phone. That gives 3 columns on a
360 dp phone and more in landscape, instead of a fixed number that only looks right on one
device.

`cardWidth` is then the leftover space divided by the columns: the full width minus the
padding on both sides (`spacing.medium * 2`) minus the gaps between the cards
(`columns - 1` gaps). That number is passed to each `MovieCard` as its width, and the card
sets `aspectRatio: 2 / 3` on the poster, so the height follows the width and posters never
stretch.

The `key={columns}` on the `FlatList` matters: `numColumns` cannot change on a mounted
`FlatList`, so changing the key forces React to build a new list when the column count
changes. Without it, rotating the phone leaves a broken layout.
