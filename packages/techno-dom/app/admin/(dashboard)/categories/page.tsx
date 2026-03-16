"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/providers/auth-provider";
import { categoryService } from "@/services/categories";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadCategories() {
    setLoading(true);
    categoryService
      .getAll()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadCategories, []);

  function resetForm() {
    setShowForm(false);
    setEditId(null);
    setName("");
    setSlug("");
    setParentId("");
    setError("");
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId ? String(cat.parentId) : "");
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
        parentId: parentId ? parseInt(parentId) : null,
      };
      if (editId) {
        await categoryService.update(editId, data, token);
      } else {
        await categoryService.create(data, token);
      }
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Удалить категорию?")) return;
    try {
      await categoryService.delete(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка удаления");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
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

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {editId ? "Редактировать" : "Новая категория"}
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
                  Родительская
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Нет</option>
                  {categories
                    .filter((c) => c.id !== editId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
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

      {/* Table */}
      {loading ? (
        <p className="text-[var(--color-text-muted)]">Загрузка...</p>
      ) : categories.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Категорий пока нет.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-gray-50">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-right px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {cat.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
