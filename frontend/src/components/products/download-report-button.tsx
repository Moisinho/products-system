"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductReport } from "@/hooks/use-product-report";
import type { ProductQuery } from "@/types/product";

export function DownloadReportButton({ query }: { query: ProductQuery }) {
  const { download, downloading } = useProductReport();

  return (
    <Button
      variant="outline"
      onClick={() => download(query)}
      disabled={downloading}
    >
      {downloading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      Descargar PDF
    </Button>
  );
}
