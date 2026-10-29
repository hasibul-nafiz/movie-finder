# Movie Finder

An Android app to find movies and keep a watchlist. Movie data comes from TMDB (The Movie Database).

## Features

1. Browse popular movies
2. Search movies by title
3. Filter movies by genre
4. View movie details (poster, rating, runtime, genres, overview, budget, revenue and more)
5. Save movies to a watchlist (stored on the phone with SQLite)
6. Share a movie with the Android share sheet

## Tech stack

- Expo, React Native and TypeScript
- Expo Router (bottom tabs)
- expo-sqlite for the watchlist
- Plain `fetch` for the TMDB API
- `StyleSheet` for styling

## What you need

- Node.js 22.13 or newer (check with `node -v`)
- A free TMDB account and API key (see step 2 below)
- One of these to run the app:
  - An Android emulator (install Android Studio, then create a virtual device in Device Manager), or
  - An Android phone with USB debugging turned on and the Expo Go app installed from the Play Store

## How to run

1. Open a terminal in the project folder and install the packages:

   ```
   npm install
   ```

2. Get a TMDB API key:
   - Create a free account at https://www.themoviedb.org
   - Open Settings > API and request a key
   - Copy the **API Key** (the short v3 key, not the long "Read Access Token")

3. Create the `.env` file. Copy `.env.example` to `.env`:

   ```
   cp .env.example .env
   ```

   On Windows use `copy .env.example .env`. Then open `.env` and paste your key:

   ```
   EXPO_PUBLIC_TMDB_API_KEY=your_key_here
   ```

4. Start the Android emulator from Android Studio (Device Manager > Play button), or connect your phone with a USB cable. Check that the device is found:

   ```
   adb devices
   ```

   The list must show your device. If `adb` is not found, add the Android SDK `platform-tools` folder to your PATH.

5. Start the app:

   ```
   npx expo start --android
   ```

   Expo opens the app on the emulator or phone. The first start can take a minute. If Expo Go is missing or too old on the emulator, Expo installs the right version.

## Check the code

```
npx tsc --noEmit
npx expo lint
```

## Troubleshooting

- **"Could not load movies":** check that the device has internet and that `.env` has a valid key. Then press Retry. After you change `.env`, stop the app and run `npx expo start --android --clear`.
- **Port 8081 is already in use:** answer yes to use another port, or close the program that uses it.
- **No device found:** run `adb devices`. The emulator must be fully started, or the phone must show "USB debugging" as allowed.
- **Phone and computer:** when using a real phone without a cable, both must be on the same Wi-Fi network.
- **Weird errors after updating packages:** delete the `node_modules` folder and run `npm install` again.

## Folder structure

```
src/
  app/             screens (Expo Router): tabs and movie details
  components/      MovieCard, MovieGrid, GenreChips, StatusView, Toast and the details parts
  services/tmdb.ts all TMDB API calls
  db/watchlist.ts  all SQLite code
  constants/       theme (colors, spacing) and the genre list
  types/movie.ts   TypeScript types
specs/product.md   product spec
```
