import { gql } from "@apollo/client";

export const QUERY_BOOKS = gql(`
    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean, $search: String) {
    books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed, search: $search) {
      id
      title
      author
      status
      isFavorite
      borrowedBy
      borrowedAt
      returnedAt
      image
    }
  }
`);
