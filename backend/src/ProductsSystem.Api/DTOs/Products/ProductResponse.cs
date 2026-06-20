namespace ProductsSystem.Api.DTOs.Products;

public record ProductResponse(
    Guid Id,
    string Nombre,
    string? Descripcion,
    decimal Precio,
    bool Estado,
    Guid UsuarioCreacion,
    DateTime FechaCreacion,
    Guid? UsuarioModificacion,
    DateTime? FechaModificacion);
