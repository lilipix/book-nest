import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Page404 from "./pages/Page404.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Signin from "./pages/Signin.tsx";
import Signup from "./pages/Signup.tsx";
import Create from "./pages/Admin.tsx";
import AuthComponent from "./components/AuthComponent.tsx";
import BadURLRedirect from "./components/BadURLRedirect.tsx";
import { AuthStates } from "./services/AuthStates.ts";
import BooksPage from "./pages/BooksPage.tsx";
import CreateBookPage from "./pages/CreateBookPage.tsx";
import EditBookPage from "./pages/EditBookPage.tsx";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: (
          <AuthComponent authStates={[AuthStates.admin]}>
            <Create />
          </AuthComponent>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: `/create-book`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <CreateBookPage />
          </AuthComponent>
        ),
      },
      {
        path: `/edit-book/:id`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <EditBookPage />
          </AuthComponent>
        ),
      },
      {
        path: `/to-read`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <BooksPage toRead={true} />
          </AuthComponent>
        ),
      },
      {
        path: `/read`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <BooksPage isRead={true} />
          </AuthComponent>
        ),
      },
      {
        path: `/favorites`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <BooksPage isFavorite={true} />
          </AuthComponent>
        ),
      },
      {
        path: `/not-read`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <BooksPage isRead={false} />
          </AuthComponent>
        ),
      },
      {
        path: `/signin`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <Signin />
          </AuthComponent>
        ),
      },
      {
        path: `/signup`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <Signup />
          </AuthComponent>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <BadURLRedirect
        authStates={[AuthStates.unauthenticated, AuthStates.user]}
      >
        <Page404 />
      </BadURLRedirect>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
