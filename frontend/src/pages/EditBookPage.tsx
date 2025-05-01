import { queryBooks } from "@/api/Books";
import { mutationUpdateBook } from "@/api/UpdateBook";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { queryBook } from "@/api/Book";

import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import DatePicker, { DatePickerFormBlockSchema } from "@/components/DatePicker";

const EditBookSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required." })
      .min(2, {
        message:
          "Le titre doit être renseigné et posséder au moins 2 caractères.",
      })
      .max(100, {
        message: "Le titre doit posséder au maximum 100 caractères.",
      }),
    author: z
      .string({ required_error: "Author is required." })
      .min(2, {
        message:
          "L'auteur doit être renseigné et posséder au moins 2 caractères.",
      })
      .max(100, {
        message: "L'auteur doit posséder au maximum 100 caractères.",
      }),
    image: z
      .string()
      .url({ message: "Doit être une URL valide." })
      .nullable()
      .optional(),
    borrowedBy: z
      .string()
      .min(2, {
        message: "Le nom de l'emprunteur doit posséder au moins 2 caractères.",
      })
      .max(100, {
        message:
          "Le nom de l'emprunteur doit posséder au maximum 100 caractères.",
      })
      .nullable()
      .optional(),
    isRead: z.boolean(),
    isFavorite: z.boolean(),
    toRead: z.boolean(),
  })
  .merge(DatePickerFormBlockSchema);

export type EditBookFormValues = z.infer<typeof EditBookSchema>;

const EditBookPage = () => {
  const { id: bookId } = useParams();
  console.log("Book ID:", bookId);
  const navigate = useNavigate();

  const { data, error, loading } = useQuery(queryBook, {
    variables: {
      id: bookId,
    },
    fetchPolicy: "cache-and-network",
    skip: !bookId,
  });

  const [EditBook] = useMutation(mutationUpdateBook, {
    refetchQueries: [
      { query: queryBooks },
      { query: queryBook, variables: { id: bookId } },
    ],
  });

  if (error) {
    console.error("Error updating book:", error);
  }
  const book = data?.book;
  console.log("Book data:", book);

  const form = useForm<EditBookFormValues>({
    resolver: zodResolver(EditBookSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (data?.book) {
      form.reset({
        title: data.book.title,
        author: data.book.author,
        image: data.book.image,
        isRead: data.book.isRead,
        toRead: data.book.toRead,
        isFavorite: data.book.isFavorite,
        borrowedBy: data.book.borrowedBy || "",
        borrowedAt: data.book.borrowedAt
          ? new Date(data.book.borrowedAt)
          : null,
      });
    }
  }, [data, form]);

  if (error) {
    return (
      <div className="text-red-500 m-4">
        Erreur :{" "}
        {error.message.includes("introuvable")
          ? "Ce livre n'existe pas."
          : "Une erreur est survenue lors du chargement."}
      </div>
    );
  }

  const handleCancel = () => {
    navigate("/");
  };

  async function onSubmit(data: z.infer<typeof EditBookSchema>) {
    try {
      if (book) {
        await EditBook({
          variables: {
            id: book.id,
            data: {
              title: data.title,
              author: data.author,
              image: data.image,
              isRead: data.isRead,
              toRead: data.toRead,
              isFavorite: data.isFavorite,
              borrowedBy: data.borrowedBy,
              borrowedAt: data.borrowedAt,
            },
          },
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center m-6">
      <h1 className="text-2xl font-bold">Modifier un livre</h1>
      <p className="text-gray-500 my-6 text-center">
        Modifier le livre dans le formulaire ci-dessous.
      </p>
      <div className="flex flex-col items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto flex flex-col gap-4"
          >
            <div className="flex flex-col gap-4 mt-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Titre"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Auteur"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value === "" ? null : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRead"
                render={({ field }) => (
                  <>
                    <FormLabel>Déjà lu ?</FormLabel>
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormDescription>
                          Cochez si vous avez déjà lu ce livre.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="toRead"
                render={({ field }) => (
                  <>
                    <FormLabel>A lire ?</FormLabel>
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormDescription>
                          Cochez si vous voulez ajouter ce livre à la liste des
                          livres à lire.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="isFavorite"
                render={({ field }) => (
                  <>
                    <FormLabel>Favori ?</FormLabel>
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormDescription>
                          Cochez si ce livre fait partie de vos favoris.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="borrowedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prêté à</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nom de l'emprunteur"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DatePicker />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button disabled={loading} type="submit">
                  Enregistrer{" "}
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBookPage;
