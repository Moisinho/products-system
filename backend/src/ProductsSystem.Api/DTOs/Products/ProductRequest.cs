namespace ProductsSystem.Api.DTOs.Products;

/// <summary>
/// Cuerpo para crear/editar un producto. Deliberadamente NO incluye Id ni los
/// campos de auditoría: esos los controla el servidor (anti over-posting).
/// </summary>
public record ProductRequest(
    string Nombre,
    string? Descripcion,
    decimal Precio,
    bool Estado);
