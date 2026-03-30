"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <button
      onClick={() => addToCart(product)}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-colors ${
        inCart
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
      }`}
    >
      <ShoppingCart className="w-4 h-4" />
      {inCart ? "В корзине" : "В корзину"}
    </button>
  );
}
