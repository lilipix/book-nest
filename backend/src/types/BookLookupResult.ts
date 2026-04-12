import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FindBookByIsbn {
  @Field(() => String)
  isbn!: string;

  @Field(() => String, { nullable: true })
  title?: string | null;

  @Field(() => String, { nullable: true })
  author?: string | null;

  @Field(() => String, { nullable: true })
  image?: string | null;
}
