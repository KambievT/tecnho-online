import { apiFetch } from "@/lib/api";
import type { LoginResponse, Admin } from "@/types";

export const authService = {
  login(login: string, password: string) {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
  },

  me(token: string) {
    return apiFetch<Admin>("/auth/me", { token });
  },
};
