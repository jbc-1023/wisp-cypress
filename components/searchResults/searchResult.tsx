import { format } from "date-fns";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";

import { Movie } from "../../types";

interface SearchResultProps {
  baseImageUrl: string;
  result: Movie;
}

const SearchResult = ({ baseImageUrl, result }: SearchResultProps) => {
  const fallbackImage = "https://via.placeholder.com/300x450";
  const description = result.overview
    ? result.overview.split(" ").slice(0, 50).join(" ")
    : undefined;
  const formattedReleaseDate = result.release_date
    ? format(new Date(result.release_date), "MMM dd, yyyy")
    : undefined;
  return (
    <Card key={result.id} className="mb-3" data-cy="searchResult">
      <Row className="g-0">
        <Col sm={4}>
          <Image
            fluid
            className="rounded-start"
            alt={`Poster for ${result.title}`}
            src={
              result.poster_path
                ? `${baseImageUrl}w500/${result.poster_path}`
                : fallbackImage
            }
          />
        </Col>
        <Col sm={8}>
          <Card.Body>
            {result.title && <Card.Title>{result.title}</Card.Title>}
            {description && <Card.Text>{description}...</Card.Text>}
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <strong>Rating:</strong> {result.vote_average}{" "}
                <small>(by {result.vote_count} raters)</small>
              </ListGroup.Item>
              {formattedReleaseDate && (
                <ListGroup.Item>
                  <strong>Release Date:</strong> {formattedReleaseDate}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default SearchResult;
