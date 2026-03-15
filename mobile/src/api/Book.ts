import { gql } from "@apollo/client";

export const queryBook = gql(`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      status
      isFavorite
      isBorrowed
      borrowedBy
      borrowedAt
      image
    }
  }
`);
