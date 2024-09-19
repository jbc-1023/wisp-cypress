import axios from "axios";

import type { MovieSearchResponse } from "../types";

export async function getSearchResults(query: string, page: number = 1) {
  const { data } = await axios.get<MovieSearchResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
        include_adult: false,
        language: "en-US",
        query,
        page,
      },
    }
  );

  return data;
}
