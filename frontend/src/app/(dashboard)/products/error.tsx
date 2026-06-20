"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-destructive-subtle text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium">Algo salió mal</p>
        <p className="text-sm text-muted-foreground">
          No se pudieron cargar los productos.
        </p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
