"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { productsApi, type ProductInput } from "@/lib/api/products";
import type { Product } from "@/types/product";

function errMessage(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => productsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success("Producto creado correctamente");
    },
    onError: (e) => toast.error(errMessage(e, "No se pudo crear el producto")),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      productsApi.update(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product-stats"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Producto actualizado");
    },
    onError: (e) => toast.error(errMessage(e, "No se pudo actualizar")),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success("Producto eliminado");
    },
    onError: (e) => toast.error(errMessage(e, "No se pudo eliminar")),
  });
}

export function useToggleEstado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) =>
      productsApi.update(product.id, {
        nombre: product.nombre,
        descripcion: product.descripcion ?? null,
        precio: product.precio,
        estado: !product.estado,
      }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success(
        updated.estado ? "Producto activado" : "Producto desactivado",
      );
    },
    onError: (e) => toast.error(errMessage(e, "No se pudo cambiar el estado")),
  });
}
