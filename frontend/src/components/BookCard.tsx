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
        <Card className="w-[350px] flex !py-0 !pb-0" key={book.id}>
          <CardHeader className="flex-col items-center !pb-2 !m-0 !pl-2">
            <div className="flex items-center space-x-2">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-auto h-24 m-2 mt-3 rounded-md"
                />
              ) : (
                <BookText className="text-muted-foreground w-auto h-20 mt-2" />
              )}
              <div>
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p>{book.author}</p>
              </div>

              {book.borrowedBy && (
                <p className="text-sm text-muted-foreground">
                  `Emprunté par ${book.borrowedBy}` `le $
                  {book.borrowedAt.toLocaleDateString()}`
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              {!book.isRead && <BookOpenCheck />}
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
