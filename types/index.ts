export interface Movie {
  poster_path?: string | null;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  genre_ids?: Array<number>;
  id?: number;
  original_title?: string;
  original_language?: string;
  title?: string;
  backdrop_path?: string | null;
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
}

export interface MovieSearchResponse {
  page: number;
  results: Array<Movie>;
  total_results: number;
  total_pages: number;
}

interface ImageConfigurationResponse {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: Array<string>;
  logo_sizes: Array<string>;
  poster_sizes: Array<string>;
  profile_sizes: Array<string>;
  still_sizes: Array<string>;
}

export interface ConfigurationResponse {
  images: ImageConfigurationResponse;
  change_keys: Array<string>;
}
