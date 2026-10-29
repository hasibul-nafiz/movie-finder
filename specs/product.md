# Movie Finder

An Android app for finding movies and keeping a watchlist of the ones you want to see.

## Core action

**Find a movie and save it to your watchlist.**

Everything in the app leads to that one action: browsing, searching and filtering are
three ways to find a movie, the details screen is where you decide, and the watchlist is
where the decision is kept.

## API

TMDB (The Movie Database) API v3, `https://api.themoviedb.org/3`.

Endpoints used:

| Endpoint | Used for |
| --- | --- |
| `/movie/popular` | Home tab, and the default list on Search |
| `/search/movie?query=` | Search by title |
| `/discover/movie?with_genres=` | Genre filter |
| `/movie/{id}` | Movie details |

Tested in the browser first: each endpoint returns JSON with a `results` array (or a
single movie object for `/movie/{id}`), so it is usable.

The key needs a free TMDB account. It is read from `EXPO_PUBLIC_TMDB_API_KEY` in `.env`,
which is in `.gitignore` and never committed. `.env.example` shows the variable name.
There is no login, so there is no test account.

No list of movies is written into the code. The only local data is the eight genre names
with their TMDB ids (`src/constants/genres.ts`), which are labels for API calls, not content.

## Features

| # | Feature | Spec |
| --- | --- | --- |
| 1 | Browse popular movies | [01-browse-popular-movies.md](01-browse-popular-movies.md) |
| 2 | Search movies by title | [02-search-movies.md](02-search-movies.md) |
| 3 | Filter movies by genre | [03-filter-by-genre.md](03-filter-by-genre.md) |
| 4 | View movie details | [04-movie-details.md](04-movie-details.md) |
| 5 | Save to a watchlist (SQLite) | [05-watchlist-sqlite.md](05-watchlist-sqlite.md) |
| 6 | Share a movie (native share sheet) | [06-share-movie.md](06-share-movie.md) |

## Choice 1: SQLite for the watchlist

**What I use.** `expo-sqlite`, one database file `movies.db` with one `watchlist` table.
The table columns are exactly what a poster card needs (id, title, poster_path,
vote_average, release_date), so a saved movie can be shown without calling TMDB again.

**The alternative I considered.** `AsyncStorage`, saving the watchlist as one JSON string.

**Why SQLite.** AsyncStorage stores one blob, so adding or removing a movie means reading
the whole list, changing it in JavaScript, and writing all of it back; two screens writing
at once can overwrite each other. With SQLite the TMDB id is the primary key, so a movie
cannot be saved twice, `INSERT OR REPLACE` and `DELETE WHERE id = ?` touch one row, and
sorting ("newest first") is `ORDER BY`, not JavaScript. It is also real query practice,
which a JSON blob would not have been.

## Choice 2: Share as the native feature

**What I use.** `Share` from `react-native`, which opens the Android share sheet with the
movie title and its TMDB link. It is built into React Native, so it needs no extra package
and no permission.

**The alternative I considered.** Notifications (`expo-notifications`), for example a
reminder about a movie on the watchlist.

**Why Share.** Sharing belongs to the core action: finding a movie you want to see is
something you tell someone about, so the feature has a reason to exist beyond ticking the
box. It also needs no runtime permission and no server, and it is testable in one tap on a
real phone. Notifications would have needed permission handling and scheduling, and a
reminder is not part of "find a movie and save it".

## What is not in the app

No Appwrite, no backend, no accounts, no paging, no ratings of my own, no trailers.
Six features, nothing else.

## Platform

Android only. Expo + React Native + TypeScript, Expo Router with bottom tabs, plain
`fetch`, `StyleSheet` with a dark theme and one accent color. Runs in Expo Go via the QR
code from `npx expo start`.
