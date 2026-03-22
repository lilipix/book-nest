import { gql } from "@/gql";

export const MUTATION_UPDATE_BOOK = gql(`
  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {
    updateBook(id: $id, data: $data) {
      id
    }
  }
`);
