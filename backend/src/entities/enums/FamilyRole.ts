import { registerEnumType } from "type-graphql";

export enum FamilyRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

registerEnumType(FamilyRole, {
  name: "FamilyRole",
});
