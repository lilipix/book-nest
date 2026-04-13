import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { FamilyLibraryBook } from "./FamilyLibraryBook";

@ObjectType()
@Entity()
@Unique(["isbn"])
export class BookMetadata extends BaseEntity {
  @PrimaryGeneratedColumn("identity", { generatedIdentity: "ALWAYS" })
  @Field(() => ID)
  id!: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 20, nullable: true })
  isbn?: string | null;

  @Field(() => String)
  @Column({ type: "varchar", length: 500 })
  title!: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 255 })
  author!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  image?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    () => FamilyLibraryBook,
    (familyLibraryBook) => familyLibraryBook.bookMetadata,
  )
  familyLibraryBooks!: FamilyLibraryBook[];
}
