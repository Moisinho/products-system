namespace ProductsSystem.Api.Entities;

/// <summary>
/// Producto del catálogo. Los campos de auditoría (Usuario*/Fecha*) los setea
/// siempre el servidor a partir del JWT y DateTime.UtcNow — nunca el cliente.
/// </summary>
public class Product
{
    public Guid Id { get; set; }                       // PK
    public string Nombre { get; set; } = default!;     // requerido
    public string? Descripcion { get; set; }           // opcional
    public decimal Precio { get; set; }                // requerido (numeric(18,2))
    public bool Estado { get; set; }                   // requerido (activo/inactivo)

    public Guid UsuarioCreacion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public Guid? UsuarioModificacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
}
