import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { BookStatus } from "./enums/BookStatus";
import { FamilyLibraryBook } from "./FamilyLibraryBook";
import { User } from "./User";

@ObjectType()
@Entity()
@Unique(["user", "familyLibraryBook"])
export class UserBookState extends BaseEntity {
  @PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
  @Field(() => ID)
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @Field(() => FamilyLibraryBook)
  @ManyToOne(
    () => FamilyLibraryBook,
    (familyLibraryBook) => familyLibraryBook.userStates,
    { onDelete: "CASCADE" },
  )
  familyLibraryBook!: FamilyLibraryBook;

  @Field(() => BookStatus)
  @Column({
    type: "enum",
    enum: BookStatus,
    default: BookStatus.UNREAD,
  })
  status!: BookStatus;

  @Field()
  @Column({ type: "boolean", default: false })
  isFavorite!: boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
