import { gql } from "@/gql";

export const queryBooks = gql(`
    query Books($isRead: Boolean, $toRead: Boolean, $isFavorite: Boolean, $isBorrowed: Boolean) {
     books(isRead: $isRead, toRead: $toRead, isFavorite: $isFavorite, isBorrowed: $isBorrowed) {
      id
      title
      author
      isRead
      toRead
      isFavorite
      isBorrowed
      borrowedBy
      borrowedAt
      image
    }
  }
`);
