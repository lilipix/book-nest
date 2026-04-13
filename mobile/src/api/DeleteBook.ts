import { gql } from "@apollo/client";

export const MUTATION_DELETE_BOOK = gql(`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`);
