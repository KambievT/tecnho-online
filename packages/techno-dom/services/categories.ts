import { apiFetch } from "@/lib/api";
import type { Category } from "@/types";

export const categoryService = {
  getAll(parentId?: number) {
    const params = parentId != null ? `?parentId=${parentId}` : "";
    return apiFetch<Category[]>(`/categories${params}`);
  },

  getById(id: number) {
    return apiFetch<Category>(`/categories/${id}`);
  },

  create(data: Partial<Category>, token: string) {
    return apiFetch<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  update(id: number, data: Partial<Category>, token: string) {
    return apiFetch<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  delete(id: number, token: string) {
    return apiFetch<void>(`/categories/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
