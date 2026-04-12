import { gql } from "@/gql";

export const QUERY_FIND_LIBRARY_BOOK_BY_ISBN = gql(`
  query FindLibraryBookByIsbn($isbn: String!) {
    findLibraryBookByIsbn(isbn: $isbn) {
      id
      isbn
      title
      author
      image
    }
  }
`);
