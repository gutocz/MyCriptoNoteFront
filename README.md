# MyCriptoNote Frontend

Interface web do MyCriptoNote: aplicação de notas criptografadas com arquitetura Zero-Knowledge. Consome a API do backend via proxy (dev) ou configuração de ambiente (produção).

## Stack

- **Angular 17** — framework
- **TypeScript 5.4**
- **SCSS** — estilos
- **ngx-translate** — i18n (pt-BR, en-US)
- **lucide-angular** — ícones
- **ngx-toastr** — notificações

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado 20 LTS)
- [npm](https://www.npmjs.com/) (vem com o Node)
- [Docker](https://docs.docker.com/get-docker/) e Docker Compose (para rodar containerizado)

---

## Rodar do zero (tudo com Docker)

Backend e frontend são repositórios separados. O frontend usa a rede Docker criada pelo backend. **Sempre suba o backend primeiro.**

### 1. Backend (API + PostgreSQL)

No repositório do backend:

```bash
cd MyCriptoNoteBack
# Crie o .env se ainda não existir (POSTGRES_PASSWORD, JWT_KEY)
docker compose up --build
```

Deixe esse terminal aberto. A API ficará em `http://localhost:5116` e o Postgres em `localhost:5433`. Na primeira vez, aplique as migrations (veja o README do backend).

### 2. Frontend (este repositório)

Em outro terminal:

```bash
cd MyCriptoNoteFront
docker compose up --build
```

A primeira build pode demorar (download da imagem Node, `npm install`). Depois, o app sobe com hot reload: alterações no código são detectadas e a aplicação recompila/recarrega no navegador.

### 3. Acessar

- **App:** [http://localhost:4200](http://localhost:4200)
- **API (Swagger):** [http://localhost:5116/swagger](http://localhost:5116/swagger)

### 4. Parar

- No terminal do frontend: `Ctrl+C` ou `docker compose down` na pasta `MyCriptoNoteFront`
- No terminal do backend: `Ctrl+C` ou `docker compose down` na pasta `MyCriptoNoteBack`

Recomendação: parar o frontend antes do backend, para evitar avisos sobre a rede externa.

---

## Rodar localmente (sem Docker)

Útil para desenvolver com o Angular CLI direto na máquina.

### 1. Backend rodando

A API precisa estar acessível. Opções:

- Backend no Docker (só Postgres + API): no repositório do backend, `docker compose up`
- Ou API rodando localmente com `dotnet run` na porta 5116

O frontend usa `proxy.conf.json`, que redireciona `/api` para `http://localhost:5116`.

### 2. Instalar dependências e subir o dev server

```bash
cd MyCriptoNoteFront
npm install
npm start
```

Ou:

```bash
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200). O proxy envia as chamadas `/api/*` para o backend; alterações no código disparam recarregamento automático.

---

## Estrutura do repositório

```
MyCriptoNoteFront/
├── docker-compose.yml         # Serviço frontend (rede mycriptonote-net)
├── Dockerfile.dev             # Imagem Node 20 + ng serve com hot reload
├── proxy.conf.json            # Proxy /api → localhost:5116 (dev local)
├── proxy.conf.docker.json     # Proxy /api → api:5116 (Docker)
├── angular.json
├── package.json
├── src/
│   ├── app/
│   ├── assets/
│   │   └── i18n/              # pt-BR.json, en-US.json
│   ├── environments/
│   ├── styles/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
└── README.md
```

---

## Scripts npm

| Comando | Descrição |
|--------|-----------|
| `npm start` / `ng serve` | Servidor de desenvolvimento (porta 4200, proxy ativo) |
| `npm run build` | Build de produção em `dist/` |
| `npm run watch` | Build em modo watch (development) |
| `ng test` | Testes unitários (Karma) |

---

## Docker: rede compartilhada

O `docker-compose.yml` do frontend declara a rede `mycriptonote-net` como **external**. Essa rede é criada pelo `docker-compose` do backend. Por isso:

1. Subir o backend primeiro garante que a rede exista.
2. O container do frontend resolve o hostname `api` e encaminha as requisições `/api` para o container da API via `proxy.conf.docker.json`.

---

## i18n

Traduções em `src/assets/i18n/` (pt-BR e en-US). Uso com `@ngx-translate/core` no app.

---

## Geração de código (Angular CLI)

```bash
ng generate component nome-do-componente
ng generate directive|pipe|service|class|guard|interface|enum|module ...
```

Mais comandos: `ng help` ou [Angular CLI](https://angular.io/cli).
