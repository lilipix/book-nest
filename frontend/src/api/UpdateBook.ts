import { gql } from "@/gql";

export const mutationUpdateBook = gql(`
  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {
    updateBook(id: $id, data: $data) {
      id
    }
  }
`);
