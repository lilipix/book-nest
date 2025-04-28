import { queryBooks } from "@/api/Books";
import BookCard from "@/components/BookCard";

import { useQuery } from "@apollo/client";

type BooksPageProps = {
  isRead?: boolean;
  isFavorite?: boolean;
  toRead?: boolean;
};

const BooksPage = ({ isRead, isFavorite, toRead }: BooksPageProps) => {
  const { data, loading, error } = useQuery(queryBooks, {
    variables: {
      isRead,
      toRead,
      isFavorite,
    },
    fetchPolicy: "cache-and-network",
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const books = data?.books;

  const getPageTitle = (
    isRead?: boolean,
    toRead?: boolean,
    isFavorite?: boolean
  ) => {
    if (isRead === true) return "Livres lus";
    if (isRead === false) return "Livres non lus";
    if (toRead) return "Livres à lire";
    if (isFavorite) return "Livres favoris";
  };

  console.log(books);
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-10">
        {getPageTitle(isRead, toRead, isFavorite)}
      </h1>
      <div className="flex justify-center mb-4">
        <BookCard books={books ?? []} />
      </div>
    </>
  );
};

export default BooksPage;
