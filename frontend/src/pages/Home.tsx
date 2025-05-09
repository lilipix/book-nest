import { Button } from "@/components/ui/button";
import bookNest from "../assets/bookNest.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold text-primary">Book Nest</h1>
      <img src={bookNest} alt="logo" className="w-64" />
      <Button className="mt-14" onClick={() => navigate("/create-book")}>
        Ajouter un livre
      </Button>
    </div>
  );
};

export default Home;
