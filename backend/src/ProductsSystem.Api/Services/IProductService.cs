using ProductsSystem.Api.Common;
using ProductsSystem.Api.DTOs.Products;

namespace ProductsSystem.Api.Services;

public interface IProductService
{
    Task<PagedResult<ProductResponse>> ListAsync(ProductQueryParams query, CancellationToken ct = default);
    Task<List<ProductResponse>> ListAllAsync(ProductQueryParams query, CancellationToken ct = default);
    Task<ProductStats> GetStatsAsync(CancellationToken ct = default);
    Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductResponse> CreateAsync(ProductRequest request, Guid userId, CancellationToken ct = default);
    Task<ProductResponse?> UpdateAsync(Guid id, ProductRequest request, Guid userId, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
