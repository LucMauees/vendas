# Sistema de Vendas

Aplicação full-stack de e-commerce com backend em Spring Boot e frontend em Angular.

## Tecnologias

**Backend**
- Java 21
- Spring Boot 4.0.1
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- springdoc-openapi 3.0.3 (Swagger)
- Lombok

**Frontend**
- Angular 21 (standalone components, Signals)
- Angular Material 21
- TypeScript 5.9

---

## Estrutura do Projeto

```
sistema-de-vendas/
├── src/                          # Backend Spring Boot
│   └── main/java/com/demo/entregas/
│       ├── config/               # SwaggerConfig
│       ├── domain/
│       │   ├── entity/           # Cliente, Produto, ItemCarrinho, Carrinho
│       │   └── enumm/            # StatusCliente, StatusProduto
│       ├── repository/           # Interfaces JPA
│       ├── service/              # Regras de negócio
│       │   └── security/         # SecurityConfig, SecurityBeansConfig
│       └── web/
│           ├── controller/       # ClienteController, ProdutoController, CarrinhoController
│           ├── dto/              # Records de Request/Response
│           └── exception/        # GlobalExceptionHandler
│
└── frontend/                     # Frontend Angular
    └── src/app/
        ├── core/
        │   ├── models/           # Interfaces tipadas (DTOs)
        │   └── services/         # ClienteService, ProdutoService, CarrinhoService, SessaoService
        ├── shared/
        │   ├── navbar/           # Componente de navegação
        │   └── produto-card/     # Card reutilizável de produto
        └── pages/
            ├── vitrine/          # Página principal com grid de produtos
            ├── cadastro/         # Formulário de cadastro de cliente
            └── carrinho/         # Carrinho de compras
```

---

## Pré-requisitos

- Java 21+
- Maven 3.9+
- PostgreSQL 14+
- Node.js 22+
- Angular CLI 21+

---

## Configuração e execução

### 1. Banco de dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE postgres;
```

As tabelas são criadas automaticamente pelo Hibernate (`ddl-auto=update`).

### 2. Certificado TLS (primeira vez)

```bash
cd src/main/resources

keytool -genkeypair \
  -alias entregas \
  -keyalg RSA -keysize 2048 \
  -storetype PKCS12 \
  -keystore keystore.p12 \
  -validity 365 \
  -storepass senha123 \
  -dname "CN=localhost, OU=Dev, O=Demo, L=SP, ST=SP, C=BR" \
  -noprompt
```

### 3. Backend

```bash
./mvnw spring-boot:run
```

O servidor sobe em `https://localhost:8443`.
Ao acessar pela primeira vez no browser, aceite o certificado autoassinado em **Avançado → Continuar para localhost**.

### 4. Frontend

```bash
cd frontend
npm install
npx ng serve
```

O frontend sobe em `http://localhost:4200`.

---

## Endpoints da API

### Cliente

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/cliente/cadastro` | Cadastrar novo cliente |
| `GET` | `/cliente/{id}` | Buscar cliente por ID |

### Produto

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/produtos` | Listar todos os produtos |
| `GET` | `/produtos?categoria=X` | Filtrar por categoria |
| `GET` | `/produtos?nome=X` | Buscar por nome |
| `GET` | `/produtos/{id}` | Buscar produto por ID |

### Carrinho

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/carrinho/{clienteId}/itens` | Adicionar item ao carrinho |
| `GET` | `/carrinho/{clienteId}/itens` | Listar itens do carrinho |
| `PUT` | `/carrinho/{clienteId}/itens/{itemId}` | Atualizar quantidade |
| `DELETE` | `/carrinho/{clienteId}/itens/{itemId}` | Remover item |

Documentação interativa disponível em `https://localhost:8443/swagger-ui.html`.

---

## Segurança

| Camada | Mecanismo |
|--------|-----------|
| Transporte | TLS 1.2 / 1.3 com certificado PKCS12 |
| Senhas | Hash BCrypt (salt automático) |
| Headers | HSTS, X-XSS-Protection, X-Frame-Options, X-Content-Type-Options |
| CORS | Permitido apenas para `localhost:4200` |

> O arquivo `keystore.p12` não deve ser versionado. Adicione ao `.gitignore`.

---

## Variáveis de configuração

Arquivo: `src/main/resources/application.properties`

| Propriedade | Padrão | Descrição |
|-------------|--------|-----------|
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/postgres` | URL do banco |
| `spring.datasource.username` | `postgres` | Usuário do banco |
| `spring.datasource.password` | `admin@123` | Senha do banco |
| `server.port` | `8443` | Porta HTTPS |
| `server.ssl.key-store-password` | `senha123` | Senha do keystore |

---

## Autor

**LucMauees**
