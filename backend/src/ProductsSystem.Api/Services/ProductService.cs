using Microsoft.EntityFrameworkCore;
using ProductsSystem.Api.Common;
using ProductsSystem.Api.Data;
using ProductsSystem.Api.DTOs.Products;
using ProductsSystem.Api.Entities;

namespace ProductsSystem.Api.Services;

public class ProductService : IProductService
{
    private const int MaxPageSize = 100;
    private readonly AppDbContext _db;

    // Allowlist de columnas ordenables (evita ORDER BY dinámico desde input crudo).
    private static readonly HashSet<string> SortableColumns = new(StringComparer.OrdinalIgnoreCase)
    {
        "nombre", "precio", "estado", "fechaCreacion", "fechaModificacion"
    };

    public ProductService(AppDbContext db) => _db = db;

    private IQueryable<Product> BuildFilteredQuery(ProductQueryParams q)
    {
        var query = _db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var term = q.Search.Trim();
            query = query.Where(p =>
                EF.Functions.ILike(p.Nombre, $"%{term}%") ||
                (p.Descripcion != null && EF.Functions.ILike(p.Descripcion, $"%{term}%")));
        }

        if (q.Estado.HasValue)
            query = query.Where(p => p.Estado == q.Estado.Value);

        if (q.PrecioMin.HasValue)
            query = query.Where(p => p.Precio >= q.PrecioMin.Value);

        if (q.PrecioMax.HasValue)
            query = query.Where(p => p.Precio <= q.PrecioMax.Value);

        return ApplySort(query, q);
    }

    private static IQueryable<Product> ApplySort(IQueryable<Product> query, ProductQueryParams q)
    {
        var sortBy = q.SortBy is not null && SortableColumns.Contains(q.SortBy)
            ? q.SortBy
            : "fechaCreacion";
        var desc = !string.Equals(q.SortDir, "asc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLowerInvariant() switch
        {
            "nombre" => desc ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre),
            "precio" => desc ? query.OrderByDescending(p => p.Precio) : query.OrderBy(p => p.Precio),
            "estado" => desc ? query.OrderByDescending(p => p.Estado) : query.OrderBy(p => p.Estado),
            "fechamodificacion" => desc
                ? query.OrderByDescending(p => p.FechaModificacion)
                : query.OrderBy(p => p.FechaModificacion),
            _ => desc ? query.OrderByDescending(p => p.FechaCreacion) : query.OrderBy(p => p.FechaCreacion),
        };
    }

    public async Task<PagedResult<ProductResponse>> ListAsync(ProductQueryParams q, CancellationToken ct = default)
    {
        var page = q.Page < 1 ? 1 : q.Page;
        var pageSize = q.PageSize < 1 ? 10 : Math.Min(q.PageSize, MaxPageSize);

        var filtered = BuildFilteredQuery(q);
        var total = await filtered.CountAsync(ct);

        var items = await filtered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => ToResponse(p))
            .ToListAsync(ct);

        return new PagedResult<ProductResponse>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<List<ProductResponse>> ListAllAsync(ProductQueryParams q, CancellationToken ct = default)
    {
        // Reporte PDF: respeta los mismos filtros pero sin paginar.
        return await BuildFilteredQuery(q)
            .Select(p => ToResponse(p))
            .ToListAsync(ct);
    }

    public async Task<ProductStats> GetStatsAsync(CancellationToken ct = default)
    {
        // KPIs calculados sobre TODO el dataset (no solo la página actual).
        var stats = await _db.Products
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Activos = g.Count(p => p.Estado),
                Valor = g.Where(p => p.Estado).Sum(p => (decimal?)p.Precio) ?? 0m
            })
            .FirstOrDefaultAsync(ct);

        if (stats is null)
            return new ProductStats(0, 0, 0, 0m);

        return new ProductStats(stats.Total, stats.Activos, stats.Total - stats.Activos, stats.Valor);
    }

    public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var p = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return p is null ? null : ToResponse(p);
    }

    public async Task<ProductResponse> CreateAsync(ProductRequest request, Guid userId, CancellationToken ct = default)
    {
        var entity = new Product
        {
            Id = Guid.NewGuid(),
            Nombre = request.Nombre.Trim(),
            Descripcion = string.IsNullOrWhiteSpace(request.Descripcion) ? null : request.Descripcion.Trim(),
            Precio = request.Precio,
            Estado = request.Estado,
            UsuarioCreacion = userId,
            FechaCreacion = DateTime.UtcNow
        };

        _db.Products.Add(entity);
        await _db.SaveChangesAsync(ct);
        return ToResponse(entity);
    }

    public async Task<ProductResponse?> UpdateAsync(Guid id, ProductRequest request, Guid userId, CancellationToken ct = default)
    {
        var entity = await _db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null)
            return null;

        entity.Nombre = request.Nombre.Trim();
        entity.Descripcion = string.IsNullOrWhiteSpace(request.Descripcion) ? null : request.Descripcion.Trim();
        entity.Precio = request.Precio;
        entity.Estado = request.Estado;
        entity.UsuarioModificacion = userId;
        entity.FechaModificacion = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return ToResponse(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null)
            return false;

        _db.Products.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    private static ProductResponse ToResponse(Product p) => new(
        p.Id, p.Nombre, p.Descripcion, p.Precio, p.Estado,
        p.UsuarioCreacion, p.FechaCreacion, p.UsuarioModificacion, p.FechaModificacion);
}
