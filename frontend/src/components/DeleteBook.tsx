// components/DeleteBook.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { mutationDeleteBook } from "@/api/DeleteBook";
import { useNavigate } from "react-router-dom";
import { queryBooks } from "@/api/Books";
import { LoaderCircle } from "lucide-react";

type DeleteBookProps = {
  id: string;
};

const DeleteBook = ({ id }: DeleteBookProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [deleteBook, { loading }] = useMutation(mutationDeleteBook);

  const handleDelete = async () => {
    try {
      await deleteBook({
        variables: { id: id },
        refetchQueries: [{ query: queryBooks }],
      });
    } catch (err) {
      console.error("err", err);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <button
        type="button"
        className="w-full text-left px-2 py-1.5 text-sm"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Supprimer
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce livre ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleDelete}
            >
              Supprimer
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBook;
