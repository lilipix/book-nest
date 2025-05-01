import { queryBooks } from "@/api/Books";
import BookCard from "@/components/BookCard";
import { Filter } from "@/types/types";

import { useQuery } from "@apollo/client";

type BooksPageProps = {
  filter?: Filter;
};

const BooksPage = ({ filter }: BooksPageProps) => {
  const getFilterVariables = (filter?: Filter) => {
    switch (filter) {
      case Filter.Read:
        return { isRead: true };
      case Filter.Unread:
        return { isRead: false };
      case Filter.ToRead:
        return { toRead: true };
      case Filter.Favorites:
        return { isFavorite: true };
      case Filter.Borrowed:
        return { borrowedBy: "__any__" };
      default:
        return {};
    }
  };
  const variables = getFilterVariables(filter);
  console.log("📦 Variables envoyées à Apollo :", variables);
  const { data, loading, error } = useQuery(queryBooks, {
    variables: getFilterVariables(filter),

    fetchPolicy: "cache-and-network",
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const books = data?.books;

  const getPageTitle = (filter?: Filter) => {
    switch (filter) {
      case Filter.Read:
        return "Livres lus";
      case Filter.Unread:
        return "Livres non lus";
      case Filter.ToRead:
        return "Livres à lire";
      case Filter.Favorites:
        return "Livres favoris";
      case Filter.Borrowed:
        return "Livres prêtés";
      default:
        return "Tous les livres";
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-10">
        {getPageTitle(filter)}
      </h1>
      <div className="flex justify-center mb-4">
        <BookCard books={books ?? []} />
      </div>
    </>
  );
};

export default BooksPage;
