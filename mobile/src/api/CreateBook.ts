import { gql } from "@apollo/client";

export const MUTATION_CREATE_BOOK = gql(`
mutation CreateBook($data: BookCreateInput!) {
    createBook(data: $data) {
      id
      title
    }
  }`);
