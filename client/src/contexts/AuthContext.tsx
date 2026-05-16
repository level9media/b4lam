import React, { createContext, useContext } from "react";
import { trpc } from "@/lib/trpc";

type Member = {
  id: number;
  name: string;
  email: string;
  role: "member" | "admin" | "staff";
  tokenBalance: number;
};

type AuthContextType = {
  member: Member | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
  member: null,
  isLoading: true,
  isAdmin: false,
  isStaff: false,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const member = data || null;
  const isAdmin = member?.role === "admin";
  const isStaff = member?.role === "admin" || member?.role === "staff";

  return (
    <AuthContext.Provider value={{ member, isLoading, isAdmin, isStaff, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
