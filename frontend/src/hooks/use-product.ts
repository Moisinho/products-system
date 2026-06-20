import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { qk } from "@/lib/query-keys";

export function useProduct(id: string, enabled = true) {
  return useQuery({
    queryKey: qk.product(id),
    queryFn: () => productsApi.get(id),
    enabled: enabled && Boolean(id),
  });
}
