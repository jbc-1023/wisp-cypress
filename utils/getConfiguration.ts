import axios from "axios";

import type { ConfigurationResponse } from "../types";

export async function getConfiguration() {
  const { data } = await axios.get<ConfigurationResponse>(
    "https://api.themoviedb.org/3/configuration?",
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
      },
    }
  );

  return data;
}
