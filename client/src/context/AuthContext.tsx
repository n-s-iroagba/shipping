"use client";
import { routes } from "@/data/routes";
import { useGetSingle } from "@/hooks/useGet";
import { createContext, ReactNode } from "react";

interface LoggedInUser {
  name: string;
  id: number;
}
export interface AuthContextValue {
  loading: boolean;
  displayName: string;
  adminId: number;
  error: string | null;
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  displayName: "",
  adminId: 0,
  error: "",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    loading,
  } = useGetSingle<LoggedInUser>(routes.auth.me);
  const displayName = user?.name || "User";
  const adminId = user?.id || 0;

  return (
    <AuthContext.Provider
      value={{
        loading,
        displayName,
        adminId,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
