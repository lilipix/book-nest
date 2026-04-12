import { Arg, Query, Resolver } from "type-graphql";

import { fetchBookByIsbnFromGoogle } from "../services/googleBooks";
import { FindBookByIsbn } from "../types/BookLookupResult";

@Resolver()
export class BookLookupResolver {
  @Query(() => FindBookByIsbn, { nullable: true })
  async findBookByIsbn(
    @Arg("isbn") isbn: string,
  ): Promise<FindBookByIsbn | null> {
    const cleanedIsbn = isbn.trim();

    if (!cleanedIsbn) {
      throw new Error("ISBN manquant");
    }

    return fetchBookByIsbnFromGoogle(cleanedIsbn);
  }
}
