import { gql } from "@apollo/client";

export const queryWhoAmI = gql(`
query Whoami {
  whoami {
    id
    email
    role
    profilePicture
  }
}
`);
