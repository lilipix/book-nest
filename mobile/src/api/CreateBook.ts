import { gql } from "@apollo/client";

export const mutationCreateBook = gql(`
mutation CreateBook($data: BookCreateInput!) {
    createBook(data: $data) {
      id
      title
    }
  }`);
