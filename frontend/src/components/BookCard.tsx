import { Card, CardHeader } from "@/components/ui/card";
import { BooksQuery } from "@/gql/graphql";
import { BookOpen, BookOpenCheck, BookText, Heart } from "lucide-react";
import ActionMenu from "./ActionMenu";

type BookCardProps = {
  books: BooksQuery["books"];
};
const BookCard = ({ books }: BookCardProps) => {
  return (
    <div className="grid mx-auto gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books?.map((book) => (
        <Card
          className="w-[350px] flex flex-col justify-between !py-0 !pb-0 "
          key={book.id}
        >
          <CardHeader className="flex flex-col !pb-2 !m-0 !pl-2 !pr-2">
            <div className="flex justify-end w-full">
              <ActionMenu id={book.id} />
            </div>
            <div className="flex items-center space-x-2 -mt-2">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-auto h-24 rounded-md"
                />
              ) : (
                <BookText className="text-muted-foreground w-auto h-20 -mt-2" />
              )}
              <div>
                <h2 className="text-base font-semibold">{book.title}</h2>
                <p>{book.author}</p>
                {book.borrowedBy && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Emprunté le{" "}
                    {book.borrowedAt &&
                      new Date(book.borrowedAt).toLocaleDateString(
                        "fr-FR"
                      )}{" "}
                    par {book.borrowedBy}
                  </p>
                )}
              </div>
            </div>
            {(book.isRead || book.toRead || book.isFavorite) && (
              <div className="flex w-full justify-end gap-2 -mt-2">
                {book.isRead && <BookOpenCheck />}
                {book.toRead && <BookOpen />}
                {book.isFavorite && <Heart className="text-red-500" />}
              </div>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default BookCard;
