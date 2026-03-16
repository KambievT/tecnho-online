import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <span className="text-[160px] md:text-[200px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-primary)] to-blue-400 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center animate-float-slow">
              <Search className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Страница не найдена
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] bg-white font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
