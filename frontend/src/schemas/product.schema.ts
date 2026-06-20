import { z } from "zod";

export const productSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(200, "Máximo 200 caracteres"),
  descripcion: z
    .string()
    .max(1000, "Máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
  precio: z.coerce
    .number({ invalid_type_error: "Precio inválido" })
    .positive("Debe ser mayor a 0")
    .max(9_999_999, "Precio fuera de rango"),
  estado: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
