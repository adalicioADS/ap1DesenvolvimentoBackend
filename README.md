# Vitrine de Produtos — Avaliação Semestral (AS): Desenvolvimento Backend

Projeto consolidado para a **Avaliação Semestral (AS) — Desenvolvimento Backend**, unificando as implementações da AP1 e AP2 com organização arquitetural e separação de responsabilidades (Models, Dtos, Data), persistência relacional com **Entity Framework Core** e **SQLite**, testes documentados via **Bruno** e **Frontend integrado** servido nativamente.

- **Tema:** Vitrine de Produtos
- **Aluno:** Adalicio Junior
- **Tecnologias:** .NET 10 (C# / ASP.NET Core Minimal APIs), Entity Framework Core, SQLite, HTML5, CSS3, JavaScript Vanilla

---

## 📹 Vídeo de demonstração — AS

> **Link Público do Vídeo da AS:**  
> `[INSIRA_AQUI_O_LINK_DO_SEU_VIDEO_DA_AS]`
>
> *(O vídeo demonstra a explicação da estrutura de pastas, namespaces, inicialização e conexão com o banco, execução de todos os testes no Bruno — incluindo 200, 201, 204, 404 — e a comprovação de persistência após reiniciar a API).*

---

## 🎯 Objetivo da Avaliação Semestral (AS)

Consolidar a API REST desenvolvida ao longo do semestre mantendo o tema, recurso (`Produto`), campos e estratégia de persistência, aplicando a organização modular por responsabilidade ensinada em aula:
1. **Separação de tipos:** Entidades de domínio em `Models/`, DTOs de entrada em `Dtos/` e o contexto de banco em `Data/`.
2. **Program.cs enxuto:** Manutenção apenas da inicialização, injeção de dependências do contexto, middlewares e mapeamento de endpoints.
3. **Persistência relacional:** Manutenção do SQLite e EF Core Migrations, garantindo persistência permanente dos dados.
4. **Validação de testes:** Roteiro completo de testes via ferramenta Bruno.

---

## 📁 Estrutura do Projeto e Responsabilidades

```text
ap1DesenvolvimentoBackend/
├── ApiProdutos.csproj          # Configuração do projeto .NET 10 e pacotes NuGet do EF Core
├── Program.cs                  # Inicialização, middlewares, DI do DbContext e rotas da API
├── appsettings.json            # Configurações da aplicação e ConnectionString do SQLite
├── appsettings.Development.json# Configurações do ambiente de desenvolvimento
├── .gitignore                  # Arquivos e diretórios ignorados pelo Git (bin, obj, *.db)
│
├── Models/                     # Camada de Domínio / Entidades
│   └── Produto.cs              # Entidade Produto (Id, Nome, Preco, Categoria)
│
├── Dtos/                       # Camada de Transferência de Dados
│   └── ProdutoDtos.cs          # ProdutoEntradaDto (record com dados de entrada para POST/PUT)
│
├── Data/                       # Camada de Acesso a Dados / Persistência
│   └── AppDbContext.cs         # DbContext do EF Core, mapeamento de tabela e Seed inicial
│
├── Migrations/                 # Migrações versionadas do Entity Framework Core
│   ├── 20261027120000_InitialCreate.cs
│   ├── 20261027120000_InitialCreate.Designer.cs
│   └── AppDbContextModelSnapshot.cs
│
├── wwwroot/                    # Frontend integrado servido pela própria API
│   ├── index.html              # Página web principal (Interface SPA)
│   ├── css/
│   │   └── style.css           # Folha de estilos responsiva
│   └── js/
│       └── app.js              # Lógica de integração Fetch API com o backend
│
├── bruno/                      # Collection oficial de testes de API no Bruno
│   ├── bruno.json              # Metadados da Collection do Bruno
│   ├── environments/
│   │   └── Local.bru           # Variável de ambiente local (baseUrl: http://localhost:5050)
│   ├── 00 - Status da API.bru
│   ├── 01 - Listar Produtos.bru
│   ├── 02 - Cadastrar Produto.bru
│   ├── 03 - Buscar Criado por ID.bru
│   ├── 04 - Atualizar Produto.bru
│   ├── 05 - Confirmar Atualizacao.bru
│   ├── 06 - Excluir Produto.bru
│   ├── 07 - Confirmar Exclusao (404).bru
│   ├── 08 - Persistencia - Cadastrar Segundo Registro.bru
│   └── 09 - Persistencia - Consultar Apos Reinicio.bru
│
└── postman/                    # Collection de apoio para testes via Postman
    └── ApiProdutos.postman_collection.json
```

### Explicação da Separação de Responsabilidades:
- **`Models/Produto.cs` (`namespace ApiProdutos.Models`):** Define a entidade que representa a tabela `Produtos` no banco de dados SQLite. Contém as propriedades de domínio (`Id`, `Nome`, `Preco`, `Categoria`).
- **`Dtos/ProdutoDtos.cs` (`namespace ApiProdutos.Dtos`):** Define o objeto de transferência de dados (`ProdutoEntradaDto`) implementado como `record`. Isola a entrada de dados do cliente, evitando a exposição e manipulação indevida do `Id` em requisições de criação e atualização.
- **`Data/AppDbContext.cs` (`namespace ApiProdutos.Data`):** Herda de `DbContext` e gerencia a conexão com o banco SQLite. Configura regras de validação (tamanhos máximos, precisão decimal) e o seed de dados no método `OnModelCreating`.
- **`Program.cs`:** Mantém apenas as chamadas essenciais: configuração da connection string, registro do `AppDbContext`, chamada de migração automática do banco, middlewares estáticos e o mapeamento dos endpoints RESTful consumindo os tipos das pastas separadas via `using`.

---

## 🗄️ Estratégia de Preparação do Banco de Dados

O projeto utiliza **Entity Framework Core Migrations** com **aplicação automática no startup**.

- **Como funciona:** No arquivo `Program.cs`, durante a inicialização, o escopo da aplicação executa `db.Database.Migrate();`. Isso significa que, se o banco `vitrine.db` ainda não existir, ele será gerado automaticamente aplicando todas as migrações da pasta `Migrations/`, incluindo a criação da tabela e os dados iniciais de carga (Seed).
- **Execução manual (opcional):** Caso o desenvolvedor prefira executar a migração via terminal com a CLI do EF Core, basta executar:
  ```bash
  dotnet ef database update
  ```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [.NET SDK 10 ou 9](https://dotnet.microsoft.com/download) instalado no sistema.
- Gerenciador de requisições [Bruno](https://www.usebruno.com/downloads) para execução dos testes.

### 1. Compilar a aplicação
No terminal, dentro da pasta raiz do projeto:
```bash
dotnet build
```

### 2. Iniciar a API
Execute a API fixando a porta padrão configurada para os testes (`5050`):
```bash
dotnet run --urls http://localhost:5050
```

Assim que a aplicação iniciar, você verá as mensagens de log indicando que a API está ouvindo em `http://localhost:5050`. O banco SQLite `vitrine.db` será criado e inicializado automaticamente.

---

## 🌐 Acesso aos Recursos

- **Frontend Integrado:** [http://localhost:5050/](http://localhost:5050/)
- **Verificação de Saúde (Status):** [http://localhost:5050/api/status](http://localhost:5050/api/status)
- **Recurso Produtos:** [http://localhost:5050/api/produtos](http://localhost:5050/api/produtos)

---

## 📋 Tabela de Rotas e Endpoints

| Método | Rota | Código HTTP Sucesso | Código HTTP Erro | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | `200 OK` | — | Serve o Frontend estático integrado (`index.html`) |
| **GET** | `/api/status` | `200 OK` | — | Diagnóstico de status e funcionamento da API |
| **GET** | `/api/produtos` | `200 OK` | — | Lista todos os produtos cadastrados no SQLite |
| **POST** | `/api/produtos` | `201 Created` | `400 Bad Request` | Cadastra um novo produto e retorna o objeto com ID |
| **GET** | `/api/produtos/{id}` | `200 OK` | `404 Not Found` | Consulta um produto específico pelo identificador |
| **PUT** | `/api/produtos/{id}` | `200 OK` | `404 Not Found` | Atualiza os dados de um produto existente |
| **DELETE**| `/api/produtos/{id}` | `204 NoContent`| `404 Not Found` | Remove o produto especificado do banco de dados |

---

## 📄 Exemplos de JSON das Requisições

### 1. Cadastrar Produto (`POST /api/produtos`)
**Corpo da requisição (JSON):**
```json
{
  "nome": "Headset Gamer 7.1",
  "preco": 350.00,
  "categoria": "Áudio"
}
```
**Resposta (`201 Created`):**
```json
{
  "id": 3,
  "nome": "Headset Gamer 7.1",
  "preco": 350.0,
  "categoria": "Áudio"
}
```

### 2. Atualizar Produto (`PUT /api/produtos/{id}`)
**Corpo da requisição (JSON):**
```json
{
  "nome": "Headset Gamer Sem Fio Pro",
  "preco": 420.00,
  "categoria": "Áudio"
}
```
**Resposta (`200 OK`):**
```json
{
  "id": 3,
  "nome": "Headset Gamer Sem Fio Pro",
  "preco": 420.0,
  "categoria": "Áudio"
}
```

### 3. Exemplo de Resposta ao Buscar por ID (`GET /api/produtos/1`)
**Resposta (`200 OK`):**
```json
{
  "id": 1,
  "nome": "Notebook Gamer",
  "preco": 4500.0,
  "categoria": "Informática"
}
```

### 4. Exemplo de Resposta para Recurso Não Encontrado (`GET /api/produtos/999`)
**Resposta (`404 Not Found`):**
```json
{
  "mensagem": "Produto com ID 999 não encontrado."
}
```

---

## 🧪 Testes no Bruno (Roteiro Obrigatório da AS)

A collection completa de testes está salva na pasta `bruno/` deste repositório.

### Como carregar e executar no Bruno:
1. Abra o aplicativo **Bruno**.
2. Clique em **Open Collection** e selecione a pasta `bruno/` deste projeto.
3. No canto superior direito, selecione o Environment **`Local`** (que aponta para `baseUrl = http://localhost:5050`).
4. Execute as requisições em ordem sequencial:

| Ordem | Arquivo no Bruno | Método | Rota | Status Esperado |
| :---: | :--- | :---: | :--- | :---: |
| 1 | `01 - Listar Produtos.bru` | `GET` | `/api/produtos` | `200 OK` |
| 2 | `02 - Cadastrar Produto.bru` | `POST` | `/api/produtos` | `201 Created` |
| 3 | `03 - Buscar Criado por ID.bru` | `GET` | `/api/produtos/{id}` | `200 OK` |
| 4 | `04 - Atualizar Produto.bru` | `PUT` | `/api/produtos/{id}` | `200 OK` |
| 5 | `05 - Confirmar Atualizacao.bru` | `GET` | `/api/produtos/{id}` | `200 OK` |
| 6 | `06 - Excluir Produto.bru` | `DELETE` | `/api/produtos/{id}` | `204 No Content` |
| 7 | `07 - Confirmar Exclusao (404).bru`| `GET` | `/api/produtos/{id}` | `404 Not Found` |

### Demonstração de Persistência (POST + Reinício + GET):
1. Execute `08 - Persistencia - Cadastrar Segundo Registro.bru` (`POST /api/produtos`) cadastrando um produto (ex: ID 4).
2. Vá até o terminal onde a API está rodando e pare a execução com `Ctrl + C`.
3. Inicie a API novamente com `dotnet run --urls http://localhost:5050`.
4. Execute `09 - Persistencia - Consultar Apos Reinicio.bru` (`GET /api/produtos/4`).
5. **Resultado:** O produto cadastrado permanece no banco SQLite e retorna com status `200 OK`, comprovando que os dados persistem após o reinício da aplicação.
