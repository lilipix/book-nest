import type { NavigatorScreenParams } from "@react-navigation/native";

export type LibraryStackParamList = {
  LibraryHome: { scannedIsbn?: string } | undefined;
  BookDetails: { bookId: number };
};

export type AjouterLivreStackParamList = {
  AddBookHome: { isbn?: string } | undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
};

export type MainTabParamList = {
  Bibliothèque: NavigatorScreenParams<LibraryStackParamList>;
  "Ajouter un livre": NavigatorScreenParams<AjouterLivreStackParamList>;
  Profil: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ScanBook: { mode: "search" | "add" };
};
