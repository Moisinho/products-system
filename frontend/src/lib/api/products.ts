import { apiFetch } from "./client";
import type {
  PagedResult,
  Product,
  ProductQuery,
  ProductStats,
} from "@/types/product";

export interface ProductInput {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  estado: boolean;
}

function estadoToParam(estado?: string): string | undefined {
  if (estado === "activos") return "true";
  if (estado === "inactivos") return "false";
  return undefined;
}

export function buildProductParams(q: ProductQuery): string {
  const p = new URLSearchParams();
  p.set("page", String(q.page));
  p.set("pageSize", String(q.pageSize));
  if (q.search?.trim()) p.set("search", q.search.trim());
  const estado = estadoToParam(q.estado);
  if (estado !== undefined) p.set("estado", estado);
  if (q.precioMin != null) p.set("precioMin", String(q.precioMin));
  if (q.precioMax != null) p.set("precioMax", String(q.precioMax));
  if (q.sortBy) p.set("sortBy", q.sortBy);
  if (q.sortDir) p.set("sortDir", q.sortDir);
  return p.toString();
}

const BASE = "/api/backend/products";

export const productsApi = {
  list: (q: ProductQuery) =>
    apiFetch<PagedResult<Product>>(`${BASE}?${buildProductParams(q)}`),
  stats: () => apiFetch<ProductStats>(`${BASE}/stats`),
  get: (id: string) => apiFetch<Product>(`${BASE}/${id}`),
  create: (body: ProductInput) =>
    apiFetch<Product>(BASE, { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: ProductInput) =>
    apiFetch<Product>(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
  reportUrl: (q: ProductQuery) =>
    `${BASE}/report/pdf?${buildProductParams(q)}`,
};
