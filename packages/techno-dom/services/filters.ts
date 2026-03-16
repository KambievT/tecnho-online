import { apiFetch } from "@/lib/api";
import type { Filter } from "@/types";

export const filterService = {
  getAll(categoryId?: number) {
    const params = categoryId != null ? `?categoryId=${categoryId}` : "";
    return apiFetch<Filter[]>(`/filters${params}`);
  },

  getById(id: number) {
    return apiFetch<Filter>(`/filters/${id}`);
  },

  create(data: Record<string, unknown>, token: string) {
    return apiFetch<Filter>("/filters", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  update(id: number, data: Record<string, unknown>, token: string) {
    return apiFetch<Filter>(`/filters/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  delete(id: number, token: string) {
    return apiFetch<void>(`/filters/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
