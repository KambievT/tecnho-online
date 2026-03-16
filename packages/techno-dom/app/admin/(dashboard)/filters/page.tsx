"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/providers/auth-provider";
import { filterService } from "@/services/filters";
import { categoryService } from "@/services/categories";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Filter, Category } from "@/types";

export default function AdminFiltersPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState<Filter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [values, setValues] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadFilters() {
    setLoading(true);
    Promise.all([filterService.getAll(), categoryService.getAll()])
      .then(([f, c]) => {
        setFilters(f);
        setCategories(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadFilters, []);

  function resetForm() {
    setShowForm(false);
    setEditId(null);
    setName("");
    setSlug("");
    setCategoryId("");
    setValues("");
    setError("");
  }

  function startEdit(f: Filter) {
    setEditId(f.id);
    setName(f.name);
    setSlug(f.slug);
    setCategoryId(f.categoryId ? String(f.categoryId) : "");
    setValues(f.values.map((v) => v.value).join(", "));
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const data = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        categoryId: categoryId ? parseInt(categoryId) : null,
        values: values
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      };
      if (editId) {
        await filterService.update(editId, data, token);
      } else {
        await filterService.create(data, token);
      }
      resetForm();
      loadFilters();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Удалить фильтр?")) return;
    try {
      await filterService.delete(id, token);
      setFilters((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка удаления");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Фильтры</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 h-10 px-4 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {editId ? "Редактировать" : "Новый фильтр"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                {error}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Название *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Категория
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Все</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Значения (через запятую)
              </label>
              <input
                type="text"
                value={values}
                onChange={(e) => setValues(e.target.value)}
                className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Красный, Синий, Зеленый"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="h-9 px-5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение..." : editId ? "Сохранить" : "Создать"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Загрузка...</p>
      ) : filters.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Фильтров пока нет.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-gray-50">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Значения</th>
                <th className="text-right px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filters.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {f.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {f.values.map((v) => v.value).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => startEdit(f)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
