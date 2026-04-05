import { useMutation } from "@apollo/client/react";

import { MUTATION_UPDATE_BOOK } from "@/api/UpdateBook";
import { UpdateBookMutation, UpdateBookMutationVariables } from "@/gql/graphql";

export const useUpdateBook = () => {
  const [mutate, { loading, error, data }] = useMutation<
    UpdateBookMutation,
    UpdateBookMutationVariables
  >(MUTATION_UPDATE_BOOK);

  const updateBook = async (variables: UpdateBookMutationVariables) => {
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
