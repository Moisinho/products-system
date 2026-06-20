using Microsoft.EntityFrameworkCore;
using ProductsSystem.Api.Entities;
using ProductsSystem.Api.Services;

namespace ProductsSystem.Api.Data;

/// <summary>
/// Carga inicial de catálogos. Idempotente: los guards .Any() evitan duplicar
/// datos cuando el contenedor reinicia o se vuelve a ejecutar `docker compose up`.
/// </summary>
public static class DbSeeder
{
    public const string AdminEmail = "admin@products.io";
    public const string AdminPassword = "Admin123!";

    public static async Task SeedAsync(AppDbContext db, IPasswordHasher hasher)
    {
        if (await db.Users.AnyAsync())
            return;

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = AdminEmail,
            Nombre = "Administrador",
            PasswordHash = hasher.Hash(AdminPassword),
            FechaCreacion = DateTime.UtcNow
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(SampleProducts(admin.Id));
            await db.SaveChangesAsync();
        }
    }

    private static IEnumerable<Product> SampleProducts(Guid creator)
    {
        var now = DateTime.UtcNow;
        (string nombre, string desc, decimal precio, bool estado)[] data =
        {
            ("Laptop Pro 14\"", "Portátil 14 pulgadas, 16GB RAM, SSD 512GB", 1499.99m, true),
            ("Monitor UltraWide 34\"", "Monitor curvo 34\" QHD 144Hz", 549.00m, true),
            ("Teclado Mecánico RGB", "Switches rojos, retroiluminación RGB", 89.90m, true),
            ("Mouse Inalámbrico", "Ergonómico, 6 botones, recargable", 39.50m, true),
            ("Webcam 1080p", "Cámara web Full HD con micrófono", 59.99m, false),
            ("Auriculares Noise Cancel", "Over-ear con cancelación activa de ruido", 199.00m, true),
            ("Hub USB-C 8 en 1", "HDMI, USB 3.0, lector SD, PD 100W", 45.00m, true),
            ("Silla Ergonómica", "Soporte lumbar ajustable, reposabrazos 4D", 329.00m, false),
        };

        foreach (var (nombre, desc, precio, estado) in data)
        {
            yield return new Product
            {
                Id = Guid.NewGuid(),
                Nombre = nombre,
                Descripcion = desc,
                Precio = precio,
                Estado = estado,
                UsuarioCreacion = creator,
                FechaCreacion = now
            };
        }
    }
}
