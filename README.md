# Vitrine de Produtos — AP2: Desenvolvimento Backend

Projeto desenvolvido para a avaliação **AP2 — Desenvolvimento Backend**, evoluindo a API da AP1 com persistência relacional através do **Entity Framework Core**, banco de dados **SQLite** e **Frontend integrado** servido na mesma origem da aplicação.

- **Tema:** Vitrine de Produtos
- **Aluno:** Adalicio Junior
- **Tecnologias:** .NET 10, ASP.NET Core Minimal APIs, Entity Framework Core 9/10, SQLite, HTML5, CSS3, JavaScript Vanilla

---

## Vídeo de demonstração — AP2


> **Link Público do Vídeo da AP2:**
> [INSIRA_AQUI_O_LINK_PUBLICO_DO_SEU_VIDEO_AP2]



## Estrutura do Projeto

```text
ap1DesenvolvimentoBackend/
├── ApiProdutos.csproj          # Configuração do projeto .NET 10 e pacotes EF Core
├── Program.cs                  # Configuração dos endpoints, DbContext e middlewares
├── appsettings.json            # Configuração da ConnectionString do SQLite
├── Models/
│   └── Produto.cs              # Entidade do domínio (Id, Nome, Preco, Categoria)
├── Data/
│   └── AppDbContext.cs         # Contexto do EF Core e mapeamento da tabela
├── Dtos/
│   └── ProdutoDtos.cs          # DTOs de transferência (ProdutoEntradaDto)
├── Migrations/                 # Migrações versionadas do EF Core
│   ├── 20261027120000_InitialCreate.cs
│   ├── 20261027120000_InitialCreate.Designer.cs
│   └── AppDbContextModelSnapshot.cs
├── wwwroot/                    # Frontend integrado servido pela mesma origem
│   ├── index.html              # Interface do usuário (SPA)
│   ├── css/
│   │   └── style.css           # Estilos e design responsivo
│   └── js/
│       └── app.js              # Integração real via Fetch API com o backend
├── bruno/                      # Collection de testes HTTP do Bruno
└── postman/                    # Collection de testes HTTP do Postman
```

---

## Como Executar o Projeto

### Pré-requisitos
- [.NET SDK 9 ou 10](https://dotnet.microsoft.com/download) instalado.

### 1. Restaurar dependências e compilar
No terminal, dentro da pasta do projeto:
```bash
dotnet build
```

### 2. Preparação do Banco de Dados SQLite
A aplicação possui aplicação automática das migrações (`Database.Migrate()`) configurada no `Program.cs`. Ao executar a API pela primeira vez, o arquivo SQLite local (`vitrine.db`) será criado automaticamente com as tabelas e o seed de dados inicial.

Se preferir aplicar as migrações manualmente via CLI do Entity Framework:
```bash
dotnet ef database update
```

### 3. Executar a Aplicação
Inicie a API fixando a porta padrão `5050`:
```bash
dotnet run --urls http://localhost:5050
```

---

## Acesso à Interface e Endpoints

- **Frontend (Interface Web):** `http://localhost:5050/`
- **Status da API:** `http://localhost:5050/api/status`
- **Coleção de Produtos:** `http://localhost:5050/api/produtos`

---

## Endpoints da API

| Método | Rota | Status Sucesso | Status Erro | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | `200 OK` | — | Serve o Frontend integrado via `index.html` |
| **GET** | `/api/status` | `200 OK` | — | Verifica saúde e status da API |
| **GET** | `/api/produtos` | `200 OK` | — | Lista todos os produtos cadastrados no SQLite |
| **GET** | `/api/produtos/{id}` | `200 OK` | `404 Not Found` | Busca um produto específico por ID |
| **POST** | `/api/produtos` | `201 Created` | `400 Bad Request` | Cadastra novo produto e persiste no banco |
| **PUT** | `/api/produtos/{id}` | `200 OK` | `404 Not Found` | Atualiza produto existente no banco |
| **DELETE**| `/api/produtos/{id}` | `204 No Content`| `404 Not Found` | Remove produto do banco |

---

## Exemplos de JSON para Requisições

### Cadastrar Produto (`POST /api/produtos`)
**Body:**
```json
{
  "nome": "Headset Gamer 7.1",
  "preco": 350.00,
  "categoria": "Áudio"
}
```
**Resposta (201 Created):**
```json
{
  "id": 3,
  "nome": "Headset Gamer 7.1",
  "preco": 350.00,
  "categoria": "Áudio"
}
```

### Atualizar Produto (`PUT /api/produtos/{id}`)
**Body:**
```json
{
  "nome": "Headset Gamer Sem Fio Pro",
  "preco": 420.00,
  "categoria": "Áudio"
}
```
**Resposta (200 OK):**
```json
{
  "id": 3,
  "nome": "Headset Gamer Sem Fio Pro",
  "preco": 420.00,
  "categoria": "Áudio"
}
```

---

## Testes Automatizados com Bruno e Postman

### Bruno
1. Abra o Bruno e selecione **Open Collection**.
2. Aponte para a pasta `bruno/` deste repositório.
3. Certifique-se de que o Environment `Local` está ativo (`baseUrl: http://localhost:5050`).
4. Execute as requisições na ordem de 00 a 06.

### Postman
1. Abra o Postman e clique em **Import**.
2. Selecione o arquivo `postman/ApiProdutos.postman_collection.json`.
3. Execute a pasta de requisições sequencialmente.
