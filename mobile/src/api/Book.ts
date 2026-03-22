import { gql } from "@apollo/client";

export const QUERYBOOK = gql(`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      status
      isbn
      isFavorite
      isBorrowed
      borrowedBy
      borrowedAt
      image
    }
  }
`);
