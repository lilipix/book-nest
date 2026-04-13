import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { FamilyLibraryBook } from "./FamilyLibraryBook";
import { FamilyMember } from "./FamilyMember";

@ObjectType()
@Entity()
export class FamilyLibrary extends BaseEntity {
  @PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
  @Field(() => ID)
  id!: number;

  @Field()
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => FamilyMember, (familyMember) => familyMember.familyLibrary)
  members!: FamilyMember[];

  @OneToMany(
    () => FamilyLibraryBook,
    (familyLibraryBook) => familyLibraryBook.familyLibrary,
  )
  books!: FamilyLibraryBook[];
}
