import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import type { Product, Category, PaginatedResponse } from "@/types";

import { getApiUrl } from "@/lib/api";

const API = getApiUrl();

export const metadata: Metadata = { title: "Каталог — Техно online" };

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getProducts(params: {
  categoryId?: string;
  search?: string;
  page?: string;
}): Promise<PaginatedResponse<Product>> {
  try {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page);
    query.set("limit", "12");
    const res = await fetch(`${API}/products?${query}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok)
      return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      categoryId: params.category,
      search: params.search,
      page: params.page,
    }),
  ]);

  const currentPage = result.page;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link
          href="/"
          className="hover:text-[var(--color-text)] transition-colors"
        >
          Главная
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-[var(--color-text)]">Каталог</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">Каталог</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Бытовая техника для вашего дома
      </p>

      {/* Search + Sort + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <form
          action="/catalog"
          method="GET"
          className="relative flex-1 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            name="search"
            defaultValue={params.search || ""}
            placeholder="Поиск товаров..."
            className="w-full h-10 pl-10 pr-4 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          />
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <select
            className="h-10 px-3 pr-8 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] appearance-none"
            defaultValue={params.sort || ""}
          >
            <option value="">По умолчанию</option>
            <option value="price_asc">Сначала дешёвые</option>
            <option value="price_desc">Сначала дорогие</option>
            <option value="new">Сначала новые</option>
          </select>
          <button className="inline-flex items-center gap-2 h-10 px-4 border border-[var(--color-border)] rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <ButtonLink
          href="/catalog"
          variant={!params.category ? "primary" : "outline"}
          size="sm"
        >
          Все
        </ButtonLink>
        {categories.map((cat) => (
          <ButtonLink
            key={cat.id}
            href={`/catalog?category=${cat.id}`}
            variant={params.category === String(cat.id) ? "primary" : "outline"}
            size="sm"
          >
            {cat.name}
          </ButtonLink>
        ))}
      </div>

      {/* Total count */}
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Найдено товаров: {result.total}
      </p>

      {/* Products */}
      {result.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {result.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <ButtonLink
                    key={page}
                    href={`/catalog?${new URLSearchParams({
                      ...(params.category ? { category: params.category } : {}),
                      ...(params.search ? { search: params.search } : {}),
                      page: String(page),
                    })}`}
                    variant={page === currentPage ? "primary" : "outline"}
                    size="sm"
                  >
                    {page}
                  </ButtonLink>
                ),
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-[var(--color-text-muted)] italic">
          Товары не найдены. Попробуйте изменить фильтры или поиск.
        </div>
      )}
    </div>
  );
}
