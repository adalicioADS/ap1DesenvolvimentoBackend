using Microsoft.EntityFrameworkCore;
using ApiProdutos.Models;

namespace ApiProdutos.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Produto> Produtos => Set<Produto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Produto>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Nome).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Categoria).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Preco).HasPrecision(18, 2);

            // Carga inicial mantendo os registros originais da AP1
            entity.HasData(
                new Produto
                {
                    Id = 1,
                    Nome = "Notebook Gamer",
                    Preco = 4500.00m,
                    Categoria = "Informática"
                },
                new Produto
                {
                    Id = 2,
                    Nome = "Mouse Sem Fio",
                    Preco = 120.50m,
                    Categoria = "Periféricos"
                }
            );
        });
    }
}
