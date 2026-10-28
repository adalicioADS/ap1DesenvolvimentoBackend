using Microsoft.EntityFrameworkCore;
using ApiProdutos.Data;
using ApiProdutos.Models;
using ApiProdutos.Dtos;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=vitrine.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

// Aplicação automática das migrations e preparação do banco SQLite
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Habilita o fornecimento de arquivos estáticos (Frontend na mesma origem da API)
app.UseDefaultFiles();
app.UseStaticFiles();

// Status da API
app.MapGet("/api/status", () => Results.Ok(new
{
    status = "online",
    mensagem = "API Vitrine de Produtos com SQLite está no ar"
}));

// 01 - Listar todos os produtos (200 OK)
app.MapGet("/api/produtos", async (AppDbContext db) =>
{
    var produtos = await db.Produtos.AsNoTracking().OrderBy(p => p.Id).ToListAsync();
    return Results.Ok(produtos);
});

// 02 - Buscar produto por ID (200 OK ou 404 Not Found)
app.MapGet("/api/produtos/{id:int}", async (int id, AppDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound(new { mensagem = $"Produto com ID {id} não encontrado." });
    }

    return Results.Ok(produto);
});

// 03 - Cadastrar novo produto (201 Created)
app.MapPost("/api/produtos", async (ProdutoEntradaDto dados, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.Nome))
    {
        return Results.BadRequest(new { mensagem = "O nome do produto é obrigatório." });
    }

    var novoProduto = new Produto
    {
        Nome = dados.Nome.Trim(),
        Preco = dados.Preco,
        Categoria = string.IsNullOrWhiteSpace(dados.Categoria) ? "Geral" : dados.Categoria.Trim()
    };

    db.Produtos.Add(novoProduto);
    await db.SaveChangesAsync();

    return Results.Created($"/api/produtos/{novoProduto.Id}", novoProduto);
});

// 04 - Atualizar produto existente (200 OK ou 404 Not Found)
app.MapPut("/api/produtos/{id:int}", async (int id, ProdutoEntradaDto dados, AppDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound(new { mensagem = $"Produto com ID {id} não encontrado." });
    }

    produto.Nome = dados.Nome.Trim();
    produto.Preco = dados.Preco;
    produto.Categoria = string.IsNullOrWhiteSpace(dados.Categoria) ? produto.Categoria : dados.Categoria.Trim();

    await db.SaveChangesAsync();

    return Results.Ok(produto);
});

// 05 - Remover produto por ID (204 No Content ou 404 Not Found)
app.MapDelete("/api/produtos/{id:int}", async (int id, AppDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound(new { mensagem = $"Produto com ID {id} não encontrado." });
    }

    db.Produtos.Remove(produto);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
