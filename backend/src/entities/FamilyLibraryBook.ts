import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { BookMetadata } from "./BookMetadata";
import { FamilyLibrary } from "./FamilyLibrary";
import { UserBookState } from "./UserBookState";

@ObjectType()
@Entity()
@Unique(["familyLibrary", "bookMetadata"])
export class FamilyLibraryBook extends BaseEntity {
  @PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
  @Field(() => ID)
  id!: number;

  @Field(() => FamilyLibrary)
  @ManyToOne(() => FamilyLibrary, (familyLibrary) => familyLibrary.books, {
    onDelete: "CASCADE",
  })
  familyLibrary!: FamilyLibrary;

  @Field(() => BookMetadata)
  @ManyToOne(
    () => BookMetadata,
    (bookMetadata) => bookMetadata.familyLibraryBooks,
    {
      onDelete: "CASCADE",
    },
  )
  bookMetadata!: BookMetadata;

  @Field()
  @Column({ type: "boolean", default: false })
  isBorrowed!: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 150, nullable: true })
  borrowedBy?: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  borrowedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  returnedAt?: Date | null;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    () => UserBookState,
    (userBookState) => userBookState.familyLibraryBook,
  )
  userStates!: UserBookState[];
}
