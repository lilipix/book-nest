import { createContext } from "react";

import { UserCreateInput } from "@/gql/graphql";
import { MeQuery } from "@/gql/graphql";

export type AuthUser = NonNullable<MeQuery["me"]>;

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
