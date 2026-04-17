import { gql } from "@/gql";

export const MUTATION_SIGN_IN = gql(`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        familyMemberships {
          id
          role
          familyLibrary {
            id
          }
        }
      }
    }
  }
`);
