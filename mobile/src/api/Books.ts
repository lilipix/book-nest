import { gql } from "@apollo/client";

export const QUERY_BOOKS = gql(`
    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean) {
     books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed) {
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
