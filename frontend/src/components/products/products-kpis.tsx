"use client";

import { Boxes, CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { KpiCard } from "@/components/common/kpi-card";
import { useProductStats } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/utils";

export function ProductsKpis() {
  const { data, isLoading } = useProductStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        index={0}
        label="Total de productos"
        value={data?.total ?? 0}
        icon={Boxes}
        loading={isLoading}
      />
      <KpiCard
        index={1}
        label="Activos"
        value={data?.activos ?? 0}
        icon={CheckCircle2}
        accent="bg-success-subtle text-success"
        loading={isLoading}
      />
      <KpiCard
        index={2}
        label="Inactivos"
        value={data?.inactivos ?? 0}
        icon={XCircle}
        accent="bg-muted text-muted-foreground"
        loading={isLoading}
      />
      <KpiCard
        index={3}
        label="Valor inventario"
        value={formatCurrency(data?.valorInventario ?? 0)}
        icon={DollarSign}
        accent="bg-info-subtle text-info"
        loading={isLoading}
      />
    </div>
  );
}
