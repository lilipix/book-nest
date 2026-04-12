import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { QueryFailedError } from "typeorm";

import {
  Book,
  BookCreateInput,
  BookStatus,
  BookUpdateInput,
} from "../entities/Book";

@Resolver()
export class BookResolver {
  @Query(() => Book, { nullable: true })
  async book(@Arg("id", () => ID) id: number): Promise<Book | null> {
    return await Book.findOneBy({ id });
  }

  @Query(() => [Book])
  async books(
    @Arg("status", () => BookStatus, { nullable: true }) status?: BookStatus,
    @Arg("isFavorite", { nullable: true }) isFavorite?: boolean,
    @Arg("isBorrowed", { nullable: true }) isBorrowed?: boolean,
    @Arg("search", { nullable: true }) search?: string,
  ): Promise<Book[]> {
    const qb = Book.createQueryBuilder("book");

    if (status) {
      qb.andWhere("book.status = :status", { status });
    }

    if (isFavorite) {
      qb.andWhere("book.isFavorite = true");
    }

    if (isBorrowed) {
      qb.andWhere("book.borrowedBy IS NOT NULL");
    }

    if (search) {
      qb.andWhere(
        `(
        unaccent(book.title) ILIKE unaccent(:search)
      OR unaccent(book.author) ILIKE unaccent(:search) OR book.isbn ILIKE :search
      )`,
        { search: `%${search}%` },
      );
    }

    qb.orderBy("book.status", "ASC").addOrderBy("book.createdAt", "DESC");

    return qb.getMany();
  }

  @Mutation(() => Book)
  async createBook(
    @Arg("data", () => BookCreateInput) data: BookCreateInput,
  ): Promise<Book> {
    try {
      const newBook = new Book();
      Object.assign(newBook, data);

      await newBook.save();

      return newBook;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).driverError?.code === "23505"
      ) {
        throw new Error("Le livre existe déjà dans la bibliothèque");
      }

      throw new Error("Erreur lors de la création du livre");
    }
  }

  @Mutation(() => Book, { nullable: true })
  async updateBook(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => BookUpdateInput)
    data: BookUpdateInput,
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

  @Query(() => Book, { nullable: true })
  async findLibraryBookByIsbn(@Arg("isbn") isbn: string): Promise<Book | null> {
    const cleanedIsbn = isbn.trim();

    if (!cleanedIsbn) {
      throw new Error("ISBN manquant");
    }

    return Book.findOne({
      where: { isbn: cleanedIsbn },
    });
  }
}
