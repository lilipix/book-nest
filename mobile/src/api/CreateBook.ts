import { gql } from "@/gql";

export const MUTATION_CREATE_BOOK = gql(`
mutation CreateBook($data: BookCreateInput!) {
    createBook(data: $data) {
      id
      title
    }
  }`);
