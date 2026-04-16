import { createContext } from "react";

import { UserCreateInput } from "@/gql/graphql";

export type AuthUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

export type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: UserCreateInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
