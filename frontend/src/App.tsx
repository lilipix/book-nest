import bookNest from "./assets/bookNest.png";
import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer
        toastClassName="toast-custom"
        bodyClassName="toast-body"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="min-h-screen">
        <header className="header">
          <Link to="/">
            <img src={bookNest} alt="Description du logo" className="w-16" />
          </Link>
          <NavBar />
        </header>
        <main className=" mt-32">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
