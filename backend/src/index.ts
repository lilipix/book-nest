import "reflect-metadata";
import { datasource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { UsersResolver } from "./resolvers/Users";
import { authChecker, getUserFromContext } from "./auth";
import { User } from "./entities/User";
import { Book } from "./entities/Book";
import { BookResolver } from "./resolvers/Books";
import express from "express";
import multer from "multer";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";

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

  app.use(cors());
  app.use(express.json());

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
    })
  );

  const upload = multer({ dest: "uploads/" });
  app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé." });
    }
    // res.json({
    //   message: "Fichier reçu",
    //   originalName: req.file.originalname,
    //   storedAs: req.file.filename,
    // });
    const user = await getUserFromContext({
      req,
      res,
      user: undefined as User | null | undefined,
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }
    user.profilePicture = req.file.path;
    await datasource.getRepository(User).save(user);

    res.json({ message: "Image de profil mise à jour." });
  });

  app.listen(5000, () => {
    console.info("🚀 Serveur disponible sur http://localhost:5000");
  });
}

initiliaze();
