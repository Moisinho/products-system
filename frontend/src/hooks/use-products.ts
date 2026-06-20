import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { qk } from "@/lib/query-keys";
import type { ProductQuery } from "@/types/product";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: qk.products(query),
    queryFn: () => productsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: qk.productStats(),
    queryFn: () => productsApi.stats(),
  });
}
