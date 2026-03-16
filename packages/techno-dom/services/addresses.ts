import { apiFetch } from "@/lib/api";
import type { Address } from "@/types";

export const addressService = {
  getAll() {
    return apiFetch<Address[]>("/addresses");
  },

  getById(id: number) {
    return apiFetch<Address>(`/addresses/${id}`);
  },

  create(data: Partial<Address>, token: string) {
    return apiFetch<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  update(id: number, data: Partial<Address>, token: string) {
    return apiFetch<Address>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  delete(id: number, token: string) {
    return apiFetch<void>(`/addresses/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
