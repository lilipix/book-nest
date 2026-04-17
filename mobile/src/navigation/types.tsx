import type { NavigatorScreenParams } from "@react-navigation/native";

export type LibraryStackParamList = {
  LibraryHome: { scannedIsbn?: string } | undefined;
  BookDetails: { bookId: number };
  EditBook: { bookId: number };
};

export type AddBookStackParamList = {
  AddBookHome: { isbn?: string } | undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
};

export type MainTabParamList = {
  Bibliothèque: NavigatorScreenParams<LibraryStackParamList>;
  "Ajouter un livre": NavigatorScreenParams<AddBookStackParamList>;
  Profil: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ScanBook: { mode: "search" | "add" };
  AddFamily: undefined;
};
