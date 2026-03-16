"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/auth";
import type { Admin } from "@/types";

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "admin_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = Cookies.get(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      authService
        .me(saved)
        .then(setAdmin)
        .catch(() => {
          Cookies.remove(TOKEN_KEY);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (login: string, password: string) => {
    const { token: t } = await authService.login(login, password);
    Cookies.set(TOKEN_KEY, t, { expires: 7, sameSite: "lax" });
    setToken(t);
    const me = await authService.me(t);
    setAdmin(me);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    setAdmin(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
