import { MUTATION_UPDATE_BOOK } from "@/api/UpdateBook";
import { Book } from "@/gql/graphql";
import { useMutation } from "@apollo/client/react";

type UpdateBookData = {
  updateBook: Book;
};

// type UpdateBookVariables = {
//   id: string;
//   data: {
//     status?: string;
//     isFavorite?: boolean;
//     isBorrowed?: boolean;
//     borrowedBy?: string | null;
//     borrowedAt?: string | null;
//     returnedAt?: string | null;
//   };
// };

export const useUpdateBook = () => {
  const [mutate, { loading, error, data }] = useMutation<UpdateBookData>(
    // UpdateBookVariables
    MUTATION_UPDATE_BOOK,
  );

  const updateBook = async (variables: UpdateBookVariables) => {
    const result = await mutate({
      variables,
    });

    return result.data?.updateBook;
  };

  return {
    updateBook,
    loading,
    error,
    data: data?.updateBook,
  };
};
