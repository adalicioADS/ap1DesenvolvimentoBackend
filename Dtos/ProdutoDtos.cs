namespace ApiProdutos.Dtos;

// DTO de entrada (para POST e PUT - sem Id)
public record ProdutoEntradaDto(string Nome, decimal Preco, string Categoria);
