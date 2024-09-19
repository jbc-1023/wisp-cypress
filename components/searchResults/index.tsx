import React from "react";

import SearchResult from "./searchResult";

import type { ConfigurationResponse, Movie } from "../../types";

interface SearchResultsProps {
  config: ConfigurationResponse;
  results: Array<Movie> | null;
}

const SearchResults = ({ config, results }: SearchResultsProps) => {
  const baseImageUrl = config.images.secure_base_url;

  if (!results) {
    return null;
  }

  return (
    <React.Fragment>
      <h2 data-cy="results_title">Results</h2>
      {results.map((result) => (
        <SearchResult
          baseImageUrl={baseImageUrl}
          result={result}
          key={result.id}
        />
      ))}
    </React.Fragment>
  );
};

export default SearchResults;
