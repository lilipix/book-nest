import { IsOptional, IsUrl, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  author!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image!: string;

  @Field()
  @Column()
  isRead: boolean = false;

  @Field()
  @Column()
  toRead: boolean = false;

  @Field()
  @Column()
  isFavorite: boolean = false;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  borrowedAt!: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  borrowedBy!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}

@InputType()
export class BookCreateInput {
  @Field()
  @Length(2, 100, { message: "Title must be between 2 and 100 chars" })
  title!: string;

  @Field()
  @Length(2, 100, { message: "Author must be between 2 and 100 chars" })
  author!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 255, { message: "Image must be between 2 and 100 chars" })
  image!: string | null;

  @Field()
  isRead!: boolean;

  @Field()
  toRead!: boolean;

  @Field()
  isFavorite!: boolean;
}
@InputType()
export class BookUpdateInput {
  @Field()
  @Length(2, 100, { message: "Title must be between 4 and 100 chars" })
  title!: string;

  @Field()
  @Length(2, 100, { message: "Author must be between 2 and 100 chars" })
  author!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 255, { message: "Image must be between 2 and 255 chars" })
  image!: string | null;

  @Field()
  isRead!: boolean;

  @Field()
  toRead!: boolean;

  @Field()
  isFavorite!: boolean;

  @Field(() => Date, { nullable: true })
  borrowedAt!: Date | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 100, { message: "Full name must be between 2 and 100 chars" })
  borrowedBy!: string | null;
}
