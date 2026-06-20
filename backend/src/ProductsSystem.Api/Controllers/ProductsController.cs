using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductsSystem.Api.Common;
using ProductsSystem.Api.DTOs.Products;
using ProductsSystem.Api.Services;

namespace ProductsSystem.Api.Controllers;

[ApiController]
[Route("api/products")]
[Authorize] // defensa en profundidad además de la política global deny-by-default
public class ProductsController : ControllerBase
{
    private readonly IProductService _products;
    private readonly IProductPdfReport _pdf;
    private readonly CurrentUser _currentUser;

    public ProductsController(IProductService products, IProductPdfReport pdf, CurrentUser currentUser)
    {
        _products = products;
        _pdf = pdf;
        _currentUser = currentUser;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<ProductResponse>>> List(
        [FromQuery] ProductQueryParams query, CancellationToken ct)
        => Ok(await _products.ListAsync(query, ct));

    [HttpGet("stats")]
    [ProducesResponseType(typeof(ProductStats), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProductStats>> Stats(CancellationToken ct)
        => Ok(await _products.GetStatsAsync(ct));

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> GetById(Guid id, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(id, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<ProductResponse>> Create(ProductRequest request, CancellationToken ct)
    {
        var created = await _products.CreateAsync(request, _currentUser.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> Update(Guid id, ProductRequest request, CancellationToken ct)
    {
        var updated = await _products.UpdateAsync(id, request, _currentUser.Id, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _products.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("report/pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Report([FromQuery] ProductQueryParams query, CancellationToken ct)
    {
        var data = await _products.ListAllAsync(query, ct);
        var bytes = _pdf.Generate(data);
        return File(bytes, "application/pdf", "reporte-productos.pdf");
    }
}
