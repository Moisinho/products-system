export interface Product {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion?: string | null;
  fechaModificacion?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductStats {
  total: number;
  activos: number;
  inactivos: number;
  valorInventario: number;
}

export type EstadoFilter = "todos" | "activos" | "inactivos";

export interface ProductQuery {
  page: number;
  pageSize: number;
  search?: string;
  estado?: EstadoFilter;
  precioMin?: number;
  precioMax?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
