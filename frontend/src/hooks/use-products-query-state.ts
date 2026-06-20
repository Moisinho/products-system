"use client";

import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { EstadoFilter } from "@/types/product";

/** Estado de la tabla (filtros + paginación + orden) sincronizado con la URL. */
export function useProductsQueryState() {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      estado: parseAsStringEnum<EstadoFilter>([
        "todos",
        "activos",
        "inactivos",
      ]).withDefault("todos"),
      precioMin: parseAsFloat,
      precioMax: parseAsFloat,
      sortBy: parseAsString.withDefault("fechaCreacion"),
      sortDir: parseAsStringEnum<"asc" | "desc">(["asc", "desc"]).withDefault(
        "desc",
      ),
    },
    { history: "replace", clearOnDefault: true, shallow: true },
  );
}
