import { gql } from "@/gql";

export const queryBooks = gql(`
    query Books($isRead: Boolean, $toRead: Boolean, $isFavorite: Boolean) {
     books(isRead: $isRead, toRead: $toRead, isFavorite: $isFavorite) {
      id
      title
      author
      isRead
      toRead
      isFavorite
      borrowedBy
      borrowedAt
      image
    }
  }
`);
