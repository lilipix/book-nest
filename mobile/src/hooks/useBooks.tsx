import { QUERY_BOOKS } from "@/api/Books";
import { Book, BookStatus } from "@/gql/graphql";
import { useQuery } from "@apollo/client/react";
import { Filter } from "@/types";

type BooksQuery = {
  books: Book[];
};

type BooksVariables = {
  status?: BookStatus;
  isFavorite?: boolean;
  borrowedBy?: string;
};

const getFilterVariables = (filter?: Filter) => {
  switch (filter) {
    case Filter.Read:
      return { status: BookStatus.Read };

    case Filter.ToRead:
      return { status: BookStatus.ToRead };

    case Filter.Favorites:
      return { isFavorite: true };

    case Filter.Borrowed:
      return { isBorrowed: true };

    default:
      return {};
  }
};

export const useBooks = (filter?: Filter, search?: string) => {
  const { data, loading, error, refetch } = useQuery<
    BooksQuery,
    BooksVariables
  >(QUERY_BOOKS, {
    variables: {
      ...getFilterVariables(filter),
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    books: data?.books ?? [],
    loading,
    error,
    refetch,
  };
};
