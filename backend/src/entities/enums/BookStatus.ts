import { registerEnumType } from "type-graphql";

export enum BookStatus {
  READ = "READ",
  UNREAD = "UNREAD",
  TO_READ = "TO_READ",
}

registerEnumType(BookStatus, {
  name: "BookStatus",
});
