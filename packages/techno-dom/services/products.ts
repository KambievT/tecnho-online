import { apiFetch } from "@/lib/api";
import type { Product, PaginatedResponse } from "@/types";

interface ProductListParams {
  categoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  getAll(params: ProductListParams = {}) {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiFetch<PaginatedResponse<Product>>(
      `/products${qs ? `?${qs}` : ""}`,
    );
  },

  getById(id: number) {
    return apiFetch<Product>(`/products/${id}`);
  },

  create(formData: FormData, token: string) {
    return apiFetch<Product>("/products", {
      method: "POST",
      body: formData,
      token,
    });
  },

  update(id: number, formData: FormData, token: string) {
    return apiFetch<Product>(`/products/${id}`, {
      method: "PUT",
      body: formData,
      token,
    });
  },

  delete(id: number, token: string) {
    return apiFetch<void>(`/products/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
