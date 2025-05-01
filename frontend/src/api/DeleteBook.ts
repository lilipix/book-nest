import { gql } from "@apollo/client";

export const mutationDeleteBook = gql(`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`);
