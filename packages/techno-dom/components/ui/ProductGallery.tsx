"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";
import { getApiUrl } from "@/lib/api";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  discount?: number;
}

function imgSrc(url: string, api: string) {
  return url.startsWith("http") ? url : `${api}${url}`;
}

export default function ProductGallery({
  images,
  productName,
  discount = 0,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const API = getApiUrl();

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 text-6xl border border-[var(--color-border)]">
        📷
      </div>
    );
  }

  const active = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-[var(--color-border)]">
        {discount > 0 && (
          <span className="absolute top-4 left-4 z-10 bg-[var(--color-accent)] text-white text-sm font-bold px-3 py-1 rounded-lg">
            −{discount}%
          </span>
        )}
        <Image
          src={imgSrc(active.url, API)}
          alt={active.alt || productName}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--color-border)] hover:border-gray-300"
              }`}
            >
              <Image
                src={imgSrc(img.url, API)}
                alt={img.alt || productName}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
