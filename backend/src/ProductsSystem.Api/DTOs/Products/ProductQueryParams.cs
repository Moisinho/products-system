namespace ProductsSystem.Api.DTOs.Products;

/// <summary>
/// Filtros + paginación + ordenamiento para el listado de productos.
/// Todo se aplica server-side. PageSize se capa en el servicio.
/// </summary>
public class ProductQueryParams
{
    public string? Search { get; set; }
    public bool? Estado { get; set; }
    public decimal? PrecioMin { get; set; }
    public decimal? PrecioMax { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    /// <summary>nombre | precio | estado | fechaCreacion | fechaModificacion</summary>
    public string? SortBy { get; set; } = "fechaCreacion";

    /// <summary>asc | desc</summary>
    public string? SortDir { get; set; } = "desc";
}
