import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Техно online — бытовая техника для дома",
  description:
    "Широкий выбор бытовой техники от ведущих мировых производителей. Доставка по всей России, гарантия и сервисное обслуживание.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
