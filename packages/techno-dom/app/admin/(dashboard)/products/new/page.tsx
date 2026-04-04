"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { productService } from "@/services/products";
import { categoryService } from "@/services/categories";
import type { Category } from "@/types";
import { X, Plus } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [inStock, setInStock] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("slug", slug || name.toLowerCase().replace(/\s+/g, "-"));
      fd.append("description", description);
      fd.append("price", price);
      if (oldPrice) fd.append("oldPrice", oldPrice);
      if (categoryId) fd.append("categoryId", categoryId);
      fd.append("inStock", String(inStock));
      files.forEach((f) => fd.append("images", f));

      await productService.create(fd, token);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Новый товар</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="auto-generated"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Цена *</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Старая цена
            </label>
            <input
              type="number"
              step="0.01"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Категория</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">Без категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 h-10 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">В наличии</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Фотографии</label>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFiles((prev) => prev.filter((_, idx) => idx !== i));
                      setPreviews((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[var(--color-border)] text-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            Добавить фото
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const added = Array.from(e.target.files || []);
                if (!added.length) return;
                setFiles((prev) => [...prev, ...added]);
                setPreviews((prev) => [
                  ...prev,
                  ...added.map((f) => URL.createObjectURL(f)),
                ]);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-6 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Создать товар"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 px-6 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
