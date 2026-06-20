"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import type { EstadoFilter } from "@/types/product";

type Patch = Partial<{
  search: string;
  estado: EstadoFilter;
  precioMin: number | null;
  precioMax: number | null;
  page: number;
}>;

interface Props {
  search: string;
  estado: EstadoFilter;
  precioMin: number | null;
  precioMax: number | null;
  onChange: (patch: Patch) => void;
  onClear: () => void;
}

export function ProductsFilters({
  search,
  estado,
  precioMin,
  precioMax,
  onChange,
  onClear,
}: Props) {
  const [searchInput, setSearchInput] = useState(search);
  const debounced = useDebounce(searchInput, 350);

  const [min, setMin] = useState(precioMin?.toString() ?? "");
  const [max, setMax] = useState(precioMax?.toString() ?? "");

  useEffect(() => {
    if (debounced !== search) onChange({ search: debounced, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Mantener inputs locales sincronizados al limpiar filtros externamente.
  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    setMin(precioMin?.toString() ?? "");
    setMax(precioMax?.toString() ?? "");
  }, [precioMin, precioMax]);

  const hasFilters =
    Boolean(search) ||
    estado !== "todos" ||
    precioMin != null ||
    precioMax != null;

  function commitPrices() {
    onChange({
      precioMin: min ? Number(min) : null,
      precioMax: max ? Number(max) : null,
      page: 1,
    });
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="pl-9"
          aria-label="Buscar productos"
        />
      </div>

      <Select
        value={estado}
        onValueChange={(v) => onChange({ estado: v as EstadoFilter, page: 1 })}
      >
        <SelectTrigger className="w-full lg:w-[150px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="activos">Activos</SelectItem>
          <SelectItem value="inactivos">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onBlur={commitPrices}
          placeholder="Mín"
          className="w-full lg:w-24"
          aria-label="Precio mínimo"
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          inputMode="decimal"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onBlur={commitPrices}
          placeholder="Máx"
          className="w-full lg:w-24"
          aria-label="Precio máximo"
        />
      </div>

      {hasFilters ? (
        <Button
          variant="ghost"
          onClick={() => {
            setSearchInput("");
            setMin("");
            setMax("");
            onClear();
          }}
          className="gap-1.5"
        >
          <X className="size-4" />
          Limpiar
        </Button>
      ) : null}
    </div>
  );
}
