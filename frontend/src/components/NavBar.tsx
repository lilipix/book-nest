import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationSignout } from "../api/Signout";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";
import { BookOpen, BookOpenCheck, Heart, MenuIcon } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  // Utilisation de la mutation signout
  const [doSignout] = useMutation(mutationSignout, {
    refetchQueries: [queryWhoAmI],
  });

  const handleSignout = () => {
    doSignout();
    navigate("/signin");
  };
  console.log("me => ", me);

  return (
    <>
      <nav>
        <div className="flex text-end">
          <Menubar className="w-fit !p-0 absolute top-0 right-0 m-2 !border-none bg-primary">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center">
                <MenuIcon className="block md:hidden w-6 h-6" />
                <span className="hidden md:block">Menu</span>
              </MenubarTrigger>
              <MenubarContent className="m-2">
                <MenubarItem>
                  <Link to="/to-read" className="">
                    Livres à lire
                  </Link>
                  <MenubarShortcut>
                    <BookOpen />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Link to="/not-read" className="">
                    Livres non lus
                  </Link>
                  {/* <MenubarShortcut>
                    <BookOpen />
                  </MenubarShortcut> */}
                </MenubarItem>
                <MenubarItem>
                  <Link to="/read" className="">
                    Livres lus
                  </Link>
                  <MenubarShortcut>
                    <BookOpenCheck />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Link to="/favorites" className="">
                    Livres favoris
                  </Link>
                  <MenubarShortcut>
                    <Heart className="text-red-500" />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Link to="/loan-books" className="">
                    Livres prêtés
                  </Link>
                  <MenubarShortcut>
                    {/* <Heart className="text-red-500" /> */}
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <Link to="/signup" className="">
                    Inscription
                  </Link>
                </MenubarItem>
                <MenubarItem>
                  <Link to="/signin" className="">
                    Connexion
                  </Link>
                </MenubarItem>
                <MenubarItem>
                  <button onClick={handleSignout} className="">
                    Déconnexion
                  </button>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
