import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { FamilyRole } from "./enums/FamilyRole";
import { FamilyLibrary } from "./FamilyLibrary";
import { User } from "./User";

@ObjectType()
@Entity()
@Unique(["user", "familyLibrary"])
export class FamilyMember extends BaseEntity {
  @PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
  @Field(() => ID)
  id!: number;

  @Field(() => FamilyRole)
  @Column({
    type: "enum",
    enum: FamilyRole,
    default: FamilyRole.MEMBER,
  })
  role!: FamilyRole;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @Field(() => FamilyLibrary)
  @ManyToOne(() => FamilyLibrary, (familyLibrary) => familyLibrary.members, {
    onDelete: "CASCADE",
  })
  familyLibrary!: FamilyLibrary;
}
