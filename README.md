# Movie Finder

An Android app to find movies and keep a watchlist. Movie data comes from TMDB (The Movie Database).

## Features

1. Browse popular movies
2. Search movies by title
3. Filter movies by genre
4. View movie details
5. Save movies to a watchlist
6. Share a movie

## Tech stack

- Expo, React Native and TypeScript
- Expo Router (bottom tabs)
- expo-sqlite for the watchlist
- Plain `fetch` for the TMDB API
- `StyleSheet` for styling

## How to run

You need an Android emulator, or a phone with USB debugging. `adb devices` must list it.

1. Install the packages:

   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and paste your TMDB v3 API key:

   ```
   EXPO_PUBLIC_TMDB_API_KEY=your_key_here
   ```

3. Start the app:

   ```
   npx expo start --android
   ```
