"use client";

import { useState } from "react";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import type { ProductQuery } from "@/types/product";

export function useProductReport() {
  const [downloading, setDownloading] = useState(false);

  async function download(query: ProductQuery) {
    setDownloading(true);
    try {
      const res = await fetch(productsApi.reportUrl(query), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("report-failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `productos-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Reporte PDF descargado");
    } catch {
      toast.error("No se pudo generar el reporte");
    } finally {
      setDownloading(false);
    }
  }

  return { download, downloading };
}
