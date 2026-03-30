import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/providers/cart-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
