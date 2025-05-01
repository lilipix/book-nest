import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";

type ActionMenuProps = {
  id: string;
};

const ActionMenu = ({ id }: ActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="mr-5">
        <DropdownMenuItem asChild>
          <Link to={`/edit-book/${id}`}>Modifier</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
