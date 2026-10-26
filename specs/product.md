# Movie Finder

## Core action

Find movies and keep a watchlist.

## Features

1. Browse popular movies.
2. Search movies by title.
3. Filter movies by genre.
4. View movie details.
5. Save a movie to the watchlist and remove it again.
6. Share a movie.

## SQLite

The phone stores the watchlist in a local SQLite database (`movies.db`). It has one table, `watchlist`:

| Column | Type | Meaning |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY | TMDB movie id |
| title | TEXT NOT NULL | Movie title |
| poster_path | TEXT | Poster path from TMDB |
| vote_average | REAL | Rating |
| release_date | TEXT | Release date |

## Native feature

Share. The Share button opens the Android share sheet with the movie title and its TMDB link.

## Popular movies

The Home screen uses TMDB's popular list (`/movie/popular`). There is no Appwrite.
