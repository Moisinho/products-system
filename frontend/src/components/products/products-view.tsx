"use client";

import Link from "next/link";
import { PackageSearch, Plus } from "lucide-react";
import { DataTablePagination } from "@/components/common/data-table-pagination";
import { EmptyState } from "@/components/common/empty-state";
import { PageTransition } from "@/components/common/page-transition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import { useProductsQueryState } from "@/hooks/use-products-query-state";
import type { ProductQuery } from "@/types/product";
import { DownloadReportButton } from "./download-report-button";
import { ProductsFilters } from "./products-filters";
import { ProductsKpis } from "./products-kpis";
import { ProductsTable } from "./products-table";

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ProductsView() {
  const [state, setState] = useProductsQueryState();

  const query: ProductQuery = {
    page: state.page,
    pageSize: state.pageSize,
    search: state.search || undefined,
    estado: state.estado,
    precioMin: state.precioMin ?? undefined,
    precioMax: state.precioMax ?? undefined,
    sortBy: state.sortBy,
    sortDir: state.sortDir,
  };

  const { data, isLoading, isPlaceholderData, isError } = useProducts(query);

  function onSort(col: string) {
    if (state.sortBy === col) {
      setState({ sortDir: state.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setState({ sortBy: col, sortDir: "asc", page: 1 });
    }
  }

  function clearFilters() {
    setState({
      search: "",
      estado: "todos",
      precioMin: null,
      precioMax: null,
      page: 1,
    });
  }

  const hasFilters =
    Boolean(state.search) ||
    state.estado !== "todos" ||
    state.precioMin != null ||
    state.precioMax != null;
  const items = data?.items ?? [];
  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground">
            Administra el catálogo de productos de tu inventario.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DownloadReportButton query={query} />
          <Button
            asChild
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Link href="/products/new">
              <Plus className="size-4" />
              Nuevo producto
            </Link>
          </Button>
        </div>
      </div>

      <ProductsKpis />

      <div className="space-y-4">
        <ProductsFilters
          search={state.search}
          estado={state.estado}
          precioMin={state.precioMin}
          precioMax={state.precioMax}
          onChange={(patch) => setState(patch)}
          onClear={clearFilters}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-lg border border-destructive-border bg-destructive-subtle p-6 text-sm text-destructive-subtle-foreground">
            No se pudieron cargar los productos. Intenta nuevamente.
          </div>
        ) : showEmpty ? (
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              icon={PackageSearch}
              title="No hay productos"
              description={
                hasFilters
                  ? "No se encontraron resultados con los filtros actuales."
                  : "Crea tu primer producto para empezar."
              }
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/products/new">
                      <Plus className="size-4" />
                      Nuevo producto
                    </Link>
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <ProductsTable
              products={items}
              sortBy={state.sortBy}
              sortDir={state.sortDir}
              onSort={onSort}
              dimmed={isPlaceholderData}
            />
            {data ? (
              <DataTablePagination
                page={data.page}
                pageSize={data.pageSize}
                total={data.total}
                totalPages={data.totalPages}
                onPageChange={(p) => setState({ page: p })}
                onPageSizeChange={(s) => setState({ pageSize: s, page: 1 })}
              />
            ) : null}
          </>
        )}
      </div>
    </PageTransition>
  );
}
