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
    "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }": typeof types.CreateBookDocument,
    "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      email\n    }\n  }": typeof types.CreateUserDocument,
    "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}": typeof types.SigninDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": typeof types.MutationDocument,
    "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n": typeof types.WhoamiDocument,
};
const documents: Documents = {
    "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }": types.CreateBookDocument,
    "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      email\n    }\n  }": types.CreateUserDocument,
    "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}": types.SigninDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": types.MutationDocument,
    "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n": types.WhoamiDocument,
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
export function gql(source: "\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }"): (typeof documents)["\nmutation CreateBook($data: BookCreateInput!) {\n    createBook(data: $data) {\n      id\n      title\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      email\n    }\n  }"): (typeof documents)["\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      email\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}"): (typeof documents)["\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation Mutation {\n  signout\n}\n  "): (typeof documents)["\nmutation Mutation {\n  signout\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n"): (typeof documents)["\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;