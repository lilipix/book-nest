import { IsOptional, IsUrl, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { registerEnumType } from "type-graphql";

export enum BookStatus {
  TO_READ = "TO_READ",
  READ = "READ",
  UNREAD = "UNREAD",
}
registerEnumType(BookStatus, {
  name: "BookStatus",
});

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Index({ unique: true })
  @Field({ nullable: true })
  @Column({ nullable: true })
  isbn!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  author!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description!: string;

  @Field(() => BookStatus)
  @Column({
    type: "enum",
    enum: BookStatus,
    default: BookStatus.UNREAD,
  })
  status: BookStatus = BookStatus.UNREAD;

  @Field()
  @Column()
  isFavorite: boolean = false;

  @Field()
  @Column({ default: false })
  isBorrowed: boolean = false;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  borrowedAt!: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  borrowedBy!: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  returnedAt!: Date;

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

  @Field(() => BookStatus)
  status!: BookStatus;

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

  validate(): void {
    const hasOne = !!this.borrowedAt || !!this.borrowedBy;
    const hasBoth = !!this.borrowedAt && !!this.borrowedBy;

    if (hasOne && !hasBoth) {
      throw new Error(
        "Les champs borrowedAt et borrowedBy doivent être remplis ensemble",
      );
    }
  }
}
