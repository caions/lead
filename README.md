# Sistema de Gestão de Leads

Um sistema para captura, gestão e análise de leads com tracking automático de UTMs.

## 🌐 Produção / Demo

- Aplicação: `https://lead-pi.vercel.app/`
- Acesso ao painel admin: `https://lead-pi.vercel.app/admin/login`

Credenciais de demonstração:
- Usuário: `admin`
- Senha: `senha123`

## 🚀 Funcionalidades

### Frontend (Next.js)
- Formulário público de cadastro de lead com captura automática de UTMs (source, medium, campaign, term, content), `gclid` e `fbclid`.
- Página de login administrativo.
- Painel de listagem de leads com:
  - Busca por nome
  - Paginação
  - Indicadores rápidos (total, por página, hoje)
  - Download de CSV
  - Ações: visualizar detalhes e deletar lead
- Página de detalhes do lead com informações pessoais e de tracking.
- Rotas principais:
  - `/` formulário público
  - `/admin/login` login
  - `/admin/leads` listagem
  - `/admin/leads/[id]` detalhes

### Backend (NestJS)
- Autenticação JWT com login via `POST /api/auth/login` e perfil via `GET /api/auth/me`.
- Leads API:
  - `POST /api/leads` (público) cria lead
  - `GET /api/leads` lista com filtros e paginação
    - Filtros: `nome`, `email`, `cargo`, `data_inicio`, `data_fim`, `utm_source`, `utm_medium`, `utm_campaign`
    - Paginação: `page`, `limit`
  - `GET /api/leads/:id` obtém um lead
  - `PATCH /api/leads/:id` atualiza um lead
  - `DELETE /api/leads/:id` remove um lead
  - `GET /api/leads/export/csv` exporta todos os leads em CSV
- Persistência com PostgreSQL + TypeORM e ordenação por `created_at DESC`.
- Tratamento de erros comuns (e.g., email duplicado).

## 📁 Estrutura do Projeto

```
/
├── backend/          # API NestJS
├── frontend/         # Interface Next.js
└── README.md
```

## 🛠️ Tecnologias

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js 14
- Tailwind CSS
- TypeScript

## 🔧 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend
```bash
cd backend
npm install
npm run start:dev
```

Variáveis de ambiente esperadas no backend:
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `DATABASE_URL` ou configs do TypeORM

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Configure `NEXT_PUBLIC_API_URL` apontando para o backend (ex.: `http://localhost:3001`).

## 📝 Licença

MIT
