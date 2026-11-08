/** Página de un listado paginado del backend (`page` empieza en 0). */
export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
