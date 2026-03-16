"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/providers/auth-provider";
import { addressService } from "@/services/addresses";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Address } from "@/types";

export default function AdminAddressesPage() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isMain, setIsMain] = useState(false);

  function loadAddresses() {
    setLoading(true);
    addressService
      .getAll()
      .then(setAddresses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadAddresses, []);

  function resetForm() {
    setShowForm(false);
    setEditId(null);
    setCity("");
    setStreet("");
    setBuilding("");
    setFloor("");
    setPhone("");
    setEmail("");
    setIsMain(false);
    setError("");
  }

  function startEdit(a: Address) {
    setEditId(a.id);
    setCity(a.city);
    setStreet(a.street);
    setBuilding(a.building);
    setFloor(a.floor || "");
    setPhone(a.phone || "");
    setEmail(a.email || "");
    setIsMain(a.isMain);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const data = {
        city,
        street,
        building,
        floor: floor || null,
        phone: phone || null,
        email: email || null,
        isMain,
      };
      if (editId) {
        await addressService.update(editId, data, token);
      } else {
        await addressService.create(data, token);
      }
      resetForm();
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Удалить адрес?")) return;
    try {
      await addressService.delete(id, token);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка удаления");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Адреса</h1>
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
              {editId ? "Редактировать" : "Новый адрес"}
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
                  Город *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Улица *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Здание *
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Этаж</label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Основной адрес</span>
            </label>
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
      ) : addresses.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Адресов пока нет.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-gray-50">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Город</th>
                <th className="text-left px-4 py-3 font-medium">Адрес</th>
                <th className="text-left px-4 py-3 font-medium">Телефон</th>
                <th className="text-right px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((addr) => (
                <tr
                  key={addr.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {addr.id}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {addr.city}
                    {addr.isMain && (
                      <span className="ml-2 text-xs bg-blue-50 text-[var(--color-primary)] px-1.5 py-0.5 rounded">
                        основной
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {addr.street}, {addr.building}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {addr.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => startEdit(addr)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
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
