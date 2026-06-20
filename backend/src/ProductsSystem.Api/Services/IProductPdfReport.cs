using ProductsSystem.Api.DTOs.Products;

namespace ProductsSystem.Api.Services;

public interface IProductPdfReport
{
    byte[] Generate(IReadOnlyList<ProductResponse> products);
}
