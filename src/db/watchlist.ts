import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import { Movie } from "@/types/movie";

let database: SQLiteDatabase | null = null;

async function getDatabase() {
  if (database === null) {
    database = await openDatabaseAsync("movies.db");
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        poster_path TEXT,
        vote_average REAL,
        release_date TEXT
      );
    `);
  }
  return database;
}

export async function addMovie(movie: Movie) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO watchlist (id, title, poster_path, vote_average, release_date) VALUES (?, ?, ?, ?, ?)",
    movie.id,
    movie.title,
    movie.poster_path,
    movie.vote_average,
    movie.release_date
  );
}

export async function removeMovie(id: number) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM watchlist WHERE id = ?", id);
}

export async function getWatchlist(): Promise<Movie[]> {
  const db = await getDatabase();
  return db.getAllAsync<Movie>("SELECT * FROM watchlist ORDER BY rowid DESC");
}

export async function isSaved(id: number) {
  const db = await getDatabase();
  const row = await db.getFirstAsync("SELECT id FROM watchlist WHERE id = ?", id);
  return row !== null;
}
