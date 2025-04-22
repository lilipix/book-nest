import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Book, BookCreateInput, BookUpdateInput } from "../entities/Book";

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  async books(): Promise<Book[]> {
    const books = await Book.find();
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
