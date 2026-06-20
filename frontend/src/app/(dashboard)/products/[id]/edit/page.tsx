"use client";

import { use } from "react";
import { PageTransition } from "@/components/common/page-transition";
import { ProductForm } from "@/components/products/product-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/use-product";

function FormSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useProduct(id);

  return (
    <PageTransition className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Editar producto</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza la información del producto.
        </p>
      </div>

      {isLoading ? (
        <FormSkeleton />
      ) : isError || !data ? (
        <div className="rounded-lg border border-destructive-border bg-destructive-subtle p-6 text-sm text-destructive-subtle-foreground">
          No se encontró el producto solicitado.
        </div>
      ) : (
        <ProductForm product={data} />
      )}
    </PageTransition>
  );
}
