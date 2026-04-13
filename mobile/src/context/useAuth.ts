import { useContext } from "react";

import { AuthContext, AuthContextType } from "./AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth is used outside of AuthProvider");
  }

  return context;
}
