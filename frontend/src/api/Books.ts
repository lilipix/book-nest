import { gql } from "@/gql";

export const queryBooks = gql(`
    query Books($isRead: Boolean, $toRead: Boolean, $isFavorite: Boolean, $borrowedBy: String) {
     books(isRead: $isRead, toRead: $toRead, isFavorite: $isFavorite, borrowedBy: $borrowedBy) {
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
