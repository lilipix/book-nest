import { Card, CardHeader } from "@/components/ui/card";
import { BooksQuery } from "@/gql/graphql";
import { BookOpen, BookOpenCheck, BookText, Heart } from "lucide-react";

type BookCardProps = {
  books: BooksQuery["books"];
};
const BookCard = ({ books }: BookCardProps) => {
  return (
    <div className="flex flex-col items-center mb-4 gap-4">
      {books?.map((book) => (
        <Card className="w-[350px] flex " key={book.id}>
          <CardHeader className="flex-col items-center gap-4">
            <div className="flex items-center">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-auto h-22 m-2"
                />
              ) : (
                <BookText className="text-muted-foreground w-auto h-20" />
              )}
              <div>
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p>{book.author}</p>
              </div>
              <div className="flex-1" />
              <p className="text-sm text-muted-foreground">
                {book.borrowedBy && `Emprunté par ${book.borrowedBy}`}
                {book.borrowedAt &&
                  `le ${book.borrowedAt.toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              {book.isRead && <BookOpenCheck />}
              {book.toRead && <BookOpen />}
              {book.isFavorite && <Heart className="text-red-500" />}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default BookCard;
