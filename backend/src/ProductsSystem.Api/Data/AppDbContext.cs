using Microsoft.EntityFrameworkCore;
using ProductsSystem.Api.Entities;

namespace ProductsSystem.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).IsRequired().HasMaxLength(256);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Nombre).IsRequired().HasMaxLength(150);
            e.Property(x => x.PasswordHash).IsRequired();
        });

        b.Entity<Product>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Nombre).IsRequired().HasMaxLength(200);
            e.Property(x => x.Descripcion).HasMaxLength(1000);
            e.Property(x => x.Precio).HasColumnType("numeric(18,2)");
            e.Property(x => x.Estado).IsRequired();
            e.HasIndex(x => x.Nombre);
            e.HasIndex(x => x.Estado);
            e.HasIndex(x => x.FechaCreacion);
        });
    }
}
