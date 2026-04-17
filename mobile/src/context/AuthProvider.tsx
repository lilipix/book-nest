import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useApolloClient, useMutation } from "@apollo/client/react";

import { QUERY_ME } from "@/api/Me";
import { MUTATION_SIGN_IN } from "@/api/SignIn";
import { MUTATION_SIGN_UP } from "@/api/SignUp";
import { UserCreateInput } from "@/gql/graphql";

import { getAuthToken, removeAuthToken, setAuthToken } from "@/lib/authStorage";

import { AuthContext, AuthContextType, AuthUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [signInMutation] = useMutation(MUTATION_SIGN_IN);
  const [signUpMutation] = useMutation(MUTATION_SIGN_UP);

  const refreshMe = useCallback(async () => {
    const { data } = await client.query({
      query: QUERY_ME,
      fetchPolicy: "no-cache",
    });

    console.log("QUERY_ME data", data);

    if (!data?.me) {
      throw new Error("Utilisateur introuvable");
    }

    setUser({
      id: String(data.me.id),
      email: data.me.email ?? null,
      firstName: data.me.firstName ?? null,
      lastName: data.me.lastName ?? null,
      familyMemberships:
        data.me.familyMemberships?.map((membership) => ({
          id: String(membership.id),
          role: membership.role,
          familyLibrary: {
            id: String(membership.familyLibrary.id),
          },
        })) ?? [],
    });
  }, [client]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getAuthToken();

        if (!token) {
          setUser(null);
          return;
        }

        await refreshMe();
      } catch (error) {
        // await removeAuthToken();
        console.error("Erreur bootstrap auth", error);
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    void bootstrap();
  }, [refreshMe]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data } = await signInMutation({
        variables: { email: email.trim(), password },
      });

      const payload = data?.signIn;

      if (!payload?.token || !payload.user) {
        throw new Error("Réponse de connexion invalide");
      }

      await setAuthToken(payload.token);
      setUser({
        id: String(payload.user.id),
        email: payload.user.email ?? null,
        firstName: payload.user.firstName ?? null,
        lastName: payload.user.lastName ?? null,
        familyMemberships:
          payload.user.familyMemberships?.map((membership) => ({
            id: String(membership.id),
            role: membership.role,
            familyLibrary: {
              id: String(membership.familyLibrary.id),
            },
          })) ?? [],
      });

      await client.clearStore();
    },
    [client, signInMutation],
  );

  const signUp = useCallback(
    async (data: UserCreateInput) => {
      const response = await signUpMutation({
        variables: { data },
      });

      const payload = response.data?.signUp;

      if (!payload?.token || !payload.user) {
        throw new Error("Réponse d'inscription invalide");
      }

      await setAuthToken(payload.token);
      setUser({
        id: String(payload.user.id),
        email: payload.user.email ?? null,
        firstName: payload.user.firstName ?? null,
        lastName: payload.user.lastName ?? null,
        familyMemberships:
          payload.user.familyMemberships?.map((membership) => ({
            id: String(membership.id),
            role: membership.role,
            familyLibrary: {
              id: String(membership.familyLibrary.id),
            },
          })) ?? [],
      });

      await client.clearStore();
    },
    [client, signUpMutation],
  );

  const signOut = useCallback(async () => {
    await removeAuthToken();
    setUser(null);
    await client.clearStore();
  }, [client]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoadingAuth,
      signIn,
      signUp,
      signOut,
      refreshMe,
    }),
    [user, isLoadingAuth, signIn, signUp, signOut, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
