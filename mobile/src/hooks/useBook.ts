import { useQuery } from "@apollo/client/react";

import { QUERYBOOK } from "@/api/Book";
import { Book } from "@/gql/graphql";

type GetBookQueryData = {
  book: Book;
};

type GetBookQueryVariables = {
  id: string;
};

export const useBook = (id: string) => {
  const { data, loading, error, refetch } = useQuery<
    GetBookQueryData,
    GetBookQueryVariables
  >(QUERYBOOK, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  return { book: data?.book, loading, error, refetch };
};
