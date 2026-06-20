"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductRowActions } from "./product-row-actions";

interface Props {
  products: Product[];
  sortBy: string;
  sortDir: "asc" | "desc";
  onSort: (col: string) => void;
  dimmed?: boolean;
}

function SortHeader({
  label,
  col,
  sortBy,
  sortDir,
  onSort,
  align = "start",
}: {
  label: string;
  col: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSort: (col: string) => void;
  align?: "start" | "end";
}) {
  const active = sortBy === col;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(col)}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        active && "text-foreground",
        align === "end" && "flex-row-reverse",
      )}
    >
      {label}
      <Icon className="size-3.5" />
    </button>
  );
}

export function ProductsTable({
  products,
  sortBy,
  sortDir,
  onSort,
  dimmed,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card transition-opacity",
        dimmed && "opacity-60",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <SortHeader
                label="Nombre"
                col="nombre"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="h-10 px-4 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <SortHeader
                label="Precio"
                col="precio"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                align="end"
              />
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <SortHeader
                label="Estado"
                col="estado"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <SortHeader
                label="Modificado"
                col="fechaModificacion"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="h-10 w-12 px-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} className="group transition-colors">
              <TableCell className="px-4 py-3">
                <div className="font-medium">{p.nombre}</div>
                {p.descripcion ? (
                  <div className="max-w-xs truncate text-xs text-muted-foreground">
                    {p.descripcion}
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="px-4 py-3 text-right tabular-nums">
                {formatCurrency(p.precio)}
              </TableCell>
              <TableCell className="px-4 py-3">
                {p.estado ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-success-border bg-success-subtle text-success-subtle-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-success" />
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-muted-foreground" />
                    Inactivo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                {formatDate(p.fechaModificacion ?? p.fechaCreacion)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <ProductRowActions product={p} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
