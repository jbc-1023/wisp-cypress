import { useRouter } from "next/router";
import { Pagination as BootstrapPagination } from "react-bootstrap";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  urlQuery: string;
}

const Pagination = ({ currentPage, totalPages, urlQuery }: PaginationProps) => {
  const router = useRouter();

  const pages = Array.from({ length: totalPages }, (_, index) => {
    const idx = index + 1;
    return (
      <BootstrapPagination.Item
        key={idx}
        active={idx === currentPage}
        onClick={() =>
          router.push({
            pathname: "/",
            query: { search: urlQuery, page: idx },
          })
        }
      >
        {idx}
      </BootstrapPagination.Item>
    );
  });

  return (
    <BootstrapPagination data-cy="pagination">{pages}</BootstrapPagination>
  );
};

export default Pagination;
