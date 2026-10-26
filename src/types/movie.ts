export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type Company = {
  id: number;
  name: string;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  tagline: string;
  status: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  budget: number;
  revenue: number;
  genres: Genre[];
  production_companies: Company[];
};
