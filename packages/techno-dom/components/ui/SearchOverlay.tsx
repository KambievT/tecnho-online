"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const POPULAR = [
  "Холодильник",
  "Стиральная машина",
  "Телевизор",
  "Пылесос",
  "Микроволновка",
];

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const encoded = encodeURIComponent(searchQuery.trim());
    router.push(`/catalog?search=${encoded}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 right-0 z-[70] bg-white shadow-2xl transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Поиск"
      >
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search input */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Что вы ищете?"
                className="w-full h-14 pl-12 pr-14 text-lg border-2 border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-primary)] bg-white transition-colors"
              />
              {query && (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Popular searches */}
          {!query && (
            <div className="mt-6">
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
                Популярные запросы
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-full hover:bg-blue-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
