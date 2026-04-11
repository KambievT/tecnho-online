import { apiFetch } from "@/lib/api";
import type { Order, PaginatedResponse } from "@/types";

export interface CreateOrderData {
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  comment?: string;
  items: { productId: number; quantity: number }[];
}

export const orderService = {
  create(data: CreateOrderData) {
    return apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll(
    params: { page?: number; limit?: number; status?: string } = {},
    token: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    const qs = query.toString();
    return apiFetch<PaginatedResponse<Order>>(`/orders${qs ? `?${qs}` : ""}`, {
      token,
    });
  },

  getById(id: number, token: string) {
    return apiFetch<Order>(`/orders/${id}`, { token });
  },

  updateStatus(id: number, status: string, token: string) {
    return apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    });
  },

  delete(id: number, token: string) {
    return apiFetch<void>(`/orders/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
