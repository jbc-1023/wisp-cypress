import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import throttle from "lodash.throttle";

import { getSearchResults } from "../../utils/getSearchResults";
import type { Movie, MovieSearchResponse } from "../../types";

interface SearchFormProps {
  urlQuery?: string;
}

const throttledSearch = throttle(getSearchResults, 300, { trailing: false });

export default function SearchForm({ urlQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>(urlQuery);
  const [autoResults, setAutoResults] = useState<Array<Movie>>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAutoResults([]);
    router.push({
      pathname: "/",
      query: { search: query, page: 1 },
    });
  }

  async function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    if (event.target.value) {
      const response = await throttledSearch(event.target.value);
      if (response) {
        setAutoResults(response.results.slice(0, 5));
      }
    } else {
      setAutoResults([]);
    }
  }

  return (
    <Form className="mb-5" onSubmit={handleSubmit}>
      <div>
        <InputGroup>
          <Form.Control
            placeholder="Search terms"
            aria-label="Search terms"
            onChange={handleOnChange}
            value={query}
            type="search"
            name="query"
          />
          <Button type="submit" data-cy="submitSearch">
            Search
          </Button>
        </InputGroup>
        {autoResults.length > 0 && (
          <ListGroup data-cy="autoResults">
            {autoResults.map((result) => (
              <ListGroup.Item
                action
                key={result.id}
                onClick={() => {
                  setQuery(result.title ?? "");
                  setAutoResults([]);
                  router.push({
                    pathname: "/",
                    query: { search: result.title, page: 1 },
                  });
                }}
              >
                {result.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </Form>
  );
}
