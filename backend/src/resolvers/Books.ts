import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Book, BookCreateInput, BookUpdateInput } from "../entities/Book";
import { IsNull, Not } from "typeorm";

@Resolver()
export class BookResolver {
  @Query(() => Book, { nullable: true })
  async book(@Arg("id", () => ID) id: number): Promise<Book | null> {
    try {
      const book = await Book.findOneBy({ id });
      if (!book) {
        throw new Error(`Book with id ${id} not found`);
      }
      return book;
    } catch (error) {
      console.error("Error fetching book:", error);
      throw new Error("Failed to fetch book");
    }
  }

  @Query(() => [Book])
  async books(
    @Arg("isRead", { nullable: true }) isRead: boolean,
    @Arg("toRead", { nullable: true }) toRead: boolean,
    @Arg("isFavorite", { nullable: true }) isFavorite: boolean,
    @Arg("borrowedBy", { nullable: true }) borrowedBy: string
  ): Promise<Book[]> {
    const query = Book.createQueryBuilder("book");

    if (typeof isRead === "boolean") {
      query.andWhere("book.isRead = :isRead", { isRead });
    }

    if (typeof toRead === "boolean") {
      query.andWhere("book.toRead = :toRead", { toRead });
    }

    if (typeof isFavorite === "boolean") {
      query.andWhere("book.isFavorite = :isFavorite", { isFavorite });
    }

    if (borrowedBy === "__any__") {
      query.andWhere("book.borrowedBy IS NOT NULL AND book.borrowedBy != ''");
    } else if (borrowedBy) {
      query.andWhere("book.borrowedBy = :borrowedBy", { borrowedBy });
    }

    const books = await query.getMany();
    return books;
  }

  @Mutation(() => Book)
  async createBook(
    @Arg("data", () => BookCreateInput) data: BookCreateInput
  ): Promise<Book> {
    const newBook = new Book();
    Object.assign(newBook, data);
    await newBook.save();
    return newBook;
  }

  @Mutation(() => Book, { nullable: true })
  async updateBook(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => BookUpdateInput)
    data: BookUpdateInput
  ): Promise<Book | null> {
    data.validate();
    const book = await Book.findOneBy({ id });
    if (!book) return null;
    Object.assign(book, data);
    try {
      await book.save();
      return book;
    } catch (error) {
      console.error("Error updating book:", error);
      throw new Error("Failed to update book");
    }
  }

  @Mutation(() => Boolean)
  async deleteBook(@Arg("id", () => ID) id: number): Promise<boolean> {
    const book = await Book.findOneBy({ id });
    if (!book) return false;
    try {
      await Book.remove(book);
      return true;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw new Error("Failed to delete book");
    }
  }
}
