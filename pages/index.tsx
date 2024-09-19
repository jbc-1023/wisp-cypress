import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Container from "react-bootstrap/Container";

import Pagination from "../components/pagination";
import SearchForm from "../components/searchForm";
import SearchResults from "../components/searchResults";
import { getConfiguration } from "../utils/getConfiguration";
import { getSearchResults } from "../utils/getSearchResults";

import type { ConfigurationResponse, MovieSearchResponse } from "../types";

interface HomeProps {
  apiConfiguration: ConfigurationResponse | null;
  page: number;
  response: MovieSearchResponse | null;
  urlQuery: string;
}

function determinePage(queryPage: string | string[] | undefined) {
  const pageString = Array.isArray(queryPage) ? queryPage[0] : queryPage;
  return pageString ? parseInt(pageString) : 1;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  query,
}) => {
  // Deal with the possibility of an array of query param values for these — not ideal
  const search = Array.isArray(query.search) ? query.search[0] : query.search;
  const page = determinePage(query.page);

  let apiConfiguration: ConfigurationResponse | null = null;
  let serverResponse: MovieSearchResponse | null = null;
  if (search) {
    const [configurationResponse, searchResultsResponse] = await Promise.all([
      getConfiguration(),
      getSearchResults(search, page),
    ]);

    apiConfiguration = configurationResponse;
    serverResponse = searchResultsResponse;
  }

  return {
    props: {
      apiConfiguration,
      page,
      response: serverResponse,
      urlQuery: search ?? "",
    },
  };
};

const Home = ({ apiConfiguration, page, response, urlQuery }: HomeProps) => {
  return (
    <Container fluid>
      <h1 data-cy="page-title">Welcome to Movie Search.</h1>
      <SearchForm urlQuery={urlQuery} />
      {response && apiConfiguration && (
        <React.Fragment>
          <SearchResults results={response.results.slice(0, 20)} config={apiConfiguration} />
          <Pagination
            currentPage={page}
            totalPages={response.total_pages}
            urlQuery={urlQuery}
          />
        </React.Fragment>
      )}
    </Container>
  );
};

export default Home;
