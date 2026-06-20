import { PageTransition } from "@/components/common/page-transition";
import { ProductForm } from "@/components/products/product-form";

export default function NewProductPage() {
  return (
    <PageTransition className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Nuevo producto</h2>
        <p className="text-sm text-muted-foreground">
          Agrega un producto al catálogo de tu inventario.
        </p>
      </div>
      <ProductForm />
    </PageTransition>
  );
}
