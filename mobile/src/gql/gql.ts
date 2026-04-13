/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Book($id: ID!) {\n    book(id: $id) {\n      id\n      title\n      author\n      status\n      isbn\n      isFavorite\n      isBorrowed\n      borrowedBy\n      borrowedAt\n      image\n    }\n  }\n": typeof types.BookDocument,
    "\n    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean, $search: String) {\n    books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed, search: $search) {\n      id\n      title\n      author\n      isbn\n      status\n      isFavorite\n      borrowedBy\n      borrowedAt\n      returnedAt\n      image\n    }\n  }\n": typeof types.BooksDocument,
    "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }": typeof types.CreateBookDocument,
    "\n  mutation DeleteBook($id: ID!) {\n    deleteBook(id: $id)\n  }\n": typeof types.DeleteBookDocument,
    "\n  query FindBookByIsbn($isbn: String!) {\n    findBookByIsbn(isbn: $isbn) {\n      isbn\n      title\n      author\n      image\n    }\n  }\n": typeof types.FindBookByIsbnDocument,
    "\n  query FindLibraryBookByIsbn($isbn: String!) {\n    findLibraryBookByIsbn(isbn: $isbn) {\n      id\n      isbn\n      title\n      author\n      image\n    }\n  }\n": typeof types.FindLibraryBookByIsbnDocument,
    "\nquery Me {\n  me {\n    id\n    email\n    firstName\n    lastName\n  }\n}\n": typeof types.MeDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\nmutation SignUp($data: UserCreateInput!) {\n    signUp(data: $data) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n": typeof types.SignUpDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": typeof types.MutationDocument,
    "\n  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {\n    updateBook(id: $id, data: $data) {\n      id\n    }\n  }\n": typeof types.UpdateBookDocument,
};
const documents: Documents = {
    "\n  query Book($id: ID!) {\n    book(id: $id) {\n      id\n      title\n      author\n      status\n      isbn\n      isFavorite\n      isBorrowed\n      borrowedBy\n      borrowedAt\n      image\n    }\n  }\n": types.BookDocument,
    "\n    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean, $search: String) {\n    books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed, search: $search) {\n      id\n      title\n      author\n      isbn\n      status\n      isFavorite\n      borrowedBy\n      borrowedAt\n      returnedAt\n      image\n    }\n  }\n": types.BooksDocument,
    "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }": types.CreateBookDocument,
    "\n  mutation DeleteBook($id: ID!) {\n    deleteBook(id: $id)\n  }\n": types.DeleteBookDocument,
    "\n  query FindBookByIsbn($isbn: String!) {\n    findBookByIsbn(isbn: $isbn) {\n      isbn\n      title\n      author\n      image\n    }\n  }\n": types.FindBookByIsbnDocument,
    "\n  query FindLibraryBookByIsbn($isbn: String!) {\n    findLibraryBookByIsbn(isbn: $isbn) {\n      id\n      isbn\n      title\n      author\n      image\n    }\n  }\n": types.FindLibraryBookByIsbnDocument,
    "\nquery Me {\n  me {\n    id\n    email\n    firstName\n    lastName\n  }\n}\n": types.MeDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n": types.SignInDocument,
    "\nmutation SignUp($data: UserCreateInput!) {\n    signUp(data: $data) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n": types.SignUpDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": types.MutationDocument,
    "\n  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {\n    updateBook(id: $id, data: $data) {\n      id\n    }\n  }\n": types.UpdateBookDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Book($id: ID!) {\n    book(id: $id) {\n      id\n      title\n      author\n      status\n      isbn\n      isFavorite\n      isBorrowed\n      borrowedBy\n      borrowedAt\n      image\n    }\n  }\n"): (typeof documents)["\n  query Book($id: ID!) {\n    book(id: $id) {\n      id\n      title\n      author\n      status\n      isbn\n      isFavorite\n      isBorrowed\n      borrowedBy\n      borrowedAt\n      image\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean, $search: String) {\n    books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed, search: $search) {\n      id\n      title\n      author\n      isbn\n      status\n      isFavorite\n      borrowedBy\n      borrowedAt\n      returnedAt\n      image\n    }\n  }\n"): (typeof documents)["\n    query Books($status: BookStatus, $isFavorite: Boolean, $isBorrowed: Boolean, $search: String) {\n    books(status: $status, isFavorite: $isFavorite, isBorrowed: $isBorrowed, search: $search) {\n      id\n      title\n      author\n      isbn\n      status\n      isFavorite\n      borrowedBy\n      borrowedAt\n      returnedAt\n      image\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }"): (typeof documents)["\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteBook($id: ID!) {\n    deleteBook(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteBook($id: ID!) {\n    deleteBook(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindBookByIsbn($isbn: String!) {\n    findBookByIsbn(isbn: $isbn) {\n      isbn\n      title\n      author\n      image\n    }\n  }\n"): (typeof documents)["\n  query FindBookByIsbn($isbn: String!) {\n    findBookByIsbn(isbn: $isbn) {\n      isbn\n      title\n      author\n      image\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindLibraryBookByIsbn($isbn: String!) {\n    findLibraryBookByIsbn(isbn: $isbn) {\n      id\n      isbn\n      title\n      author\n      image\n    }\n  }\n"): (typeof documents)["\n  query FindLibraryBookByIsbn($isbn: String!) {\n    findLibraryBookByIsbn(isbn: $isbn) {\n      id\n      isbn\n      title\n      author\n      image\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Me {\n  me {\n    id\n    email\n    firstName\n    lastName\n  }\n}\n"): (typeof documents)["\nquery Me {\n  me {\n    id\n    email\n    firstName\n    lastName\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation SignUp($data: UserCreateInput!) {\n    signUp(data: $data) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\nmutation SignUp($data: UserCreateInput!) {\n    signUp(data: $data) {\n      token\n      user {\n        id\n        email\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation Mutation {\n  signout\n}\n  "): (typeof documents)["\nmutation Mutation {\n  signout\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {\n    updateBook(id: $id, data: $data) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {\n    updateBook(id: $id, data: $data) {\n      id\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;