import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { buildSchema } from "type-graphql";

import { authChecker, getUserFromContext } from "./auth";
import { datasource } from "./datasource";
import { Book } from "./entities/Book";
import { User } from "./entities/User";
import { BookResolver } from "./resolvers/Books";
import { UsersResolver } from "./resolvers/Users";
import { upload } from "./utils/multer";

import "reflect-metadata";
// import cookieParser from "cookie-parser";

async function initiliaze() {
  await datasource.initialize();
  console.info("Datasource is connected 🔌");

  const schema = await buildSchema({
    resolvers: [UsersResolver, BookResolver],
    validate: true,
    authChecker,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();

  // app.use(cors());
  app.use(express.json());
  // app.use(cookieParser());

  // return healthcheck healthy
  app.post("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const context = {
          req,
          res,
          user: undefined as User | null | undefined,
        };

        const user = await getUserFromContext(context);
        context.user = user;
        return context;
      },
    }),
  );

  app.use("/uploads", express.static("uploads"));

  // app.post("/upload", upload.single("file"), async (req, res) => {
  //   if (!req.file) {
  //     return res.status(400).json({ error: "Aucun fichier envoyé." });
  //   }
  //   const user = await getUserFromContext({
  //     req,
  //     res,
  //     user: undefined as User | null | undefined,
  //   });

  //   if (!user) {
  //     return res.status(401).json({ error: "Utilisateur non authentifié." });
  //   }
  //   user.profilePicture = req.file.path;
  //   await datasource.getRepository(User).save(user);

  //   res.json({ message: "Image saved." });
  // });

  app.post("/books/:id/cover", upload.single("file"), async (req, res) => {
    const bookId = Number(req.params.id);

    const book = await datasource.getRepository(Book).findOneBy({ id: bookId });

    if (!book) {
      return res.status(404).json({ error: "Livre introuvable" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    const publicPath = `/uploads/${req.file.filename}`;
    book.image = publicPath;

    await datasource.getRepository(Book).save(book);

    res.json({ message: "Couverture enregistrée", image: publicPath });
  });

  app.listen(5000, () => {
    console.info("🚀 Serveur disponible sur http://localhost:5000");
  });
}

initiliaze();
