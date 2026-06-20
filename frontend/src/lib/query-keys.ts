import type { ProductQuery } from "@/types/product";

export const qk = {
  products: (q: ProductQuery) => ["products", q] as const,
  product: (id: string) => ["product", id] as const,
  productStats: () => ["product-stats"] as const,
  session: () => ["session"] as const,
};
