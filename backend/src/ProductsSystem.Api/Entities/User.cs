namespace ProductsSystem.Api.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string Nombre { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public DateTime FechaCreacion { get; set; }
}
