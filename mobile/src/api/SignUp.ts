import { gql } from "../gql";

export const MUTATION_SIGN_UP = gql(`
mutation SignUp($data: UserCreateInput!) {
    signUp(data: $data) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`);
