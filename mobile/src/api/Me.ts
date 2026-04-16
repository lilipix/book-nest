import { gql } from "@/gql";

export const QUERY_ME = gql(`
query Me {
  me {
    id
    email
    firstName
    lastName
  }
}
`);
