using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ProductsSystem.Api.Data;

/// <summary>
/// Usado SOLO por las herramientas de diseño (dotnet ef) para generar migraciones
/// sin ejecutar Program.cs ni conectarse a una base real. La cadena de conexión
/// solo debe ser parseable; no se abre ninguna conexión al generar la migración.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=productsdb;Username=products;Password=products_dev_pwd")
            .Options;

        return new AppDbContext(options);
    }
}
