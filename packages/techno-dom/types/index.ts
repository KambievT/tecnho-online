/* ——— API типы, соответствующие Prisma-моделям бекенда ——— */

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  parentId: number | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterValue {
  id: number;
  value: string;
  filterId: number;
}

export interface Filter {
  id: number;
  name: string;
  slug: string;
  categoryId: number | null;
  values: FilterValue[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  position: number;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string; // Decimal приходит как строка
  oldPrice: string | null;
  inStock: boolean;
  categoryId: number | null;
  category?: Category;
  images: ProductImage[];
  filterValues?: { filterValue: FilterValue & { filter: Filter } }[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  city: string;
  street: string;
  building: string;
  floor: string | null;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginResponse {
  token: string;
}

export type OrderStatus = "NEW" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  address: string | null;
  comment: string | null;
  status: OrderStatus;
  totalPrice: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  login: string;
}
