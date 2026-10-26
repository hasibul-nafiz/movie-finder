import { Movie, MovieDetails } from "@/types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type MovieList = { results: Movie[] };

async function request(path: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({
    api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "",
    ...params,
  });
  const response = await fetch(`${BASE_URL}${path}?${query}`);
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }
  return response.json();
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data: MovieList = await request("/movie/popular");
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data: MovieList = await request("/search/movie", { query });
  return data.results;
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data: MovieList = await request("/discover/movie", {
    with_genres: String(genreId),
  });
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return request(`/movie/${id}`);
}

export function getPosterUrl(path: string | null): string | null {
  if (path === null) {
    return null;
  }
  return `${IMAGE_URL}${path}`;
}
