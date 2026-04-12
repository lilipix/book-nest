import { gql } from "@/gql";

export const QUERY_FIND_BOOK_BY_ISBN = gql(`
  query FindBookByIsbn($isbn: String!) {
    findBookByIsbn(isbn: $isbn) {
      isbn
      title
      author
      image
    }
  }
`);
