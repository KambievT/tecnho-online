"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import {
  Package,
  FolderTree,
  SlidersHorizontal,
  MapPin,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Заявки", href: "/admin/orders", icon: ClipboardList },
  { label: "Товары", href: "/admin/products", icon: Package },
  { label: "Категории", href: "/admin/categories", icon: FolderTree },
  { label: "Фильтры", href: "/admin/filters", icon: SlidersHorizontal },
  { label: "Адреса", href: "/admin/addresses", icon: MapPin },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Загрузка...</div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-muted)]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-[var(--color-border)] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-[var(--color-border)]">
          <Link
            href="/admin/products"
            className="font-bold text-[var(--color-primary)]"
          >
            Админ-панель
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] hover:bg-gray-50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
