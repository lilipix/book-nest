import { DocumentNode, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Card } from "@/components/ui/card";

import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mutationCreateBook } from "@/api/CreateBook";
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
import { queryBooks } from "@/api/Books";

const CreateBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(2, {
      message:
        "Le titre doit être renseigné et posséder au moins 2 caractères.",
    })
    .max(100, {
      message:
        "Le titre doit être renseigné et posséder au maximum 100 caractères.",
    }),
  author: z
    .string({ required_error: "Author is required." })
    .min(2, {
      message:
        "L'auteur doit être renseigné et posséder au moins 2 caractères.",
    })
    .max(100, {
      message:
        "L'auteur doit être renseigné et posséder au maximum 100 caractères.",
    }),
  image: z
    .string()
    .url({ message: "Doit être une URL valide." })
    .nullable()
    .optional(),
  isRead: z.boolean(),
  isFavorite: z.boolean(),
  toRead: z.boolean(),
});

export type CreateBookFormValues = z.infer<typeof CreateBookSchema>;

const CreateBookPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"manual" | "scan" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanOpen, setIsScanOpen] = useState(true);
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const [createBook, { loading }] = useMutation(
    mutationCreateBook as DocumentNode,
    {
      refetchQueries: [{ query: queryBooks }],
    }
  );
  const form = useForm<CreateBookFormValues>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: {
      title: "",
      author: "",
      image: null,
      isRead: false,
      toRead: false,
      isFavorite: false,
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === "scan" && isScanOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsScanOpen(false);
        setError(
          "Aucun code détecté après 15 secondes. Veuillez saisir le livre manuellement."
        );
      }, 15000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [mode, isScanOpen]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScanUpdate = async (error: unknown, result: any) => {
    if (error) {
      if ((error as Error).name === "NotFoundException") {
        return;
      }
      console.error("Scan error:", error);
      return;
    }
    if (result) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const scannedIsbn = result.text || "";
      console.log("Scanned ISBN:", scannedIsbn);
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${scannedIsbn}&key=${apiKey}`
        );
        const data = await res.json();
        console.log("Book data:", data);
        if (data.totalItems > 0) {
          const book = data.items[0].volumeInfo;
          form.setValue("title", book.title || "");
          form.setValue("author", book.authors ? book.authors.join(", ") : "");
          form.setValue("image", book.imageLinks?.thumbnail || null);
          navigate("/create-book");
        } else if (data.totalItems === 0) {
          setIsScanOpen(false);
          setError("Livre non trouvé, veuillez le saisir manuellement.");
          return;
        }
        setMode("manual");
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du livre :",
          error
        );
      }
    }
  };

  async function onSubmit(data: z.infer<typeof CreateBookSchema>) {
    try {
      await createBook({
        variables: {
          data: {
            title: data.title,
            author: data.author,
            image: data.image,
            isRead: data.isRead,
            toRead: data.toRead,
            isFavorite: data.isFavorite,
          },
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  const handleCancel = () => navigate("/");
  return (
    <div className="flex flex-col items-center justify-center m-6">
      <h1 className="text-2xl font-bold border border-border rounded-md w-full text-center py-3 bg-primary opacity-75">
        Ajouter un livre
      </h1>
      <p className="text-grey-800 my-6 text-center">
        Ajoutez un livre en le scannant ou en le saisissant manuellement.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex flex-col gap-4"
        >
          <div className="flex justify-center gap-4">
            <Button type="button" onClick={() => setMode("scan")}>
              Scanner le code barre
            </Button>
            <Button type="button" onClick={() => setMode("manual")}>
              Saisie manuelle
            </Button>
          </div>
          {mode === "scan" && isScanOpen && (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 my-6">
                Si le livre n'est pas trouvé, vous pourrez le saisir
                manuellement.
              </p>
              <BarcodeScannerComponent
                width={300}
                height={300}
                onUpdate={handleScanUpdate}
              />
              <p className="text-gray-500 my-6">
                En attente de la détection du code…
              </p>
            </div>
          )}
          {error && (
            <div className="text-red-500 m-6">
              <p>{error}</p>
            </div>
          )}
          {mode === "manual" && (
            <Card className="px-6">
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
                          value={field.value}
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
                          value={field.value}
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
                          value={field.value || ""}
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-3">
                        <div>
                          <FormDescription className="text-md text-foreground">
                            Cochez si vous avez déjà lu ce livre.
                          </FormDescription>

                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormDescription className="text-md text-foreground">
                            Cochez si vous voulez ajouter ce livre à la liste
                            des livres à lire.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormDescription className="text-md text-foreground">
                            Cochez si ce livre fait partie de vos favoris.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    </>
                  )}
                />
                <div className="flex justify-between m-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
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
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CreateBookPage;
