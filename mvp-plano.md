# MVP - PLANO DE IMPLEMENTAÇÃO SIMPLIFICADO
## Sistema de Gestão de Leads

### 🎯 OBJETIVO
Criar um MVP funcional com as 4 páginas principais: formulário público, login admin, listagem de leads e detalhes do lead.

---

## 📋 FASE 1: SETUP INICIAL

### 1.1 Estrutura do Projeto
- [x] Criar pasta raiz do projeto
- [x] Criar subpastas: `backend/` e `frontend/`
- [x] Configurar `.gitignore` básico
- [x] Criar `README.md` principal

### 1.2 Backend - Setup Básico
- [x] Executar `nest new backend`
- [x] Instalar dependências essenciais:
  - [x] `@nestjs/typeorm typeorm pg`
  - [x] `class-validator class-transformer`
  - [x] `@nestjs/jwt @nestjs/passport bcrypt`
- [x] Configurar `.env` com variáveis básicas

### 1.3 Frontend - Setup Básico  
- [ ] Executar `npx create-next-app@latest frontend`
- [ ] Instalar dependências:
  - [ ] `tailwindcss`
  - [ ] `axios`
- [ ] Configurar Tailwind CSS
- [ ] Criar `.env.local` com URL da API

### 1.4 Banco de Dados
- [ ] Instalar PostgreSQL com docker
- [ ] Criar banco `leads_db`
- [ ] Configurar conexão no TypeORM

---

## 🔧 FASE 2: BACKEND - API ESSENCIAL

### 2.1 Entidade Lead
- [ ] Criar `Lead` entity com campos:
  - [ ] id, nome, email, telefone, cargo, data_nascimento, mensagem
  - [ ] utm_source, utm_medium, utm_campaign, utm_term, utm_content
  - [ ] gclid, fbclid, created_at, updated_at

### 2.2 DTOs e Validações
- [ ] Criar `CreateLeadDto` com validações:
  - [ ] Email válido
  - [ ] Telefone brasileiro
  - [ ] Campos obrigatórios
- [ ] Criar `UpdateLeadDto`

### 2.3 LeadsService
- [ ] Implementar métodos básicos:
  - [ ] `create()` - criar lead
  - [ ] `findAll()` - listar com paginação
  - [ ] `findOne()` - buscar por ID
  - [ ] `update()` - atualizar
  - [ ] `remove()` - deletar
  - [ ] `exportCSV()` - exportar CSV

### 2.4 LeadsController
- [ ] Criar endpoints:
  - [ ] `POST /api/leads` (público)
  - [ ] `GET /api/leads` (protegido)
  - [ ] `GET /api/leads/:id` (protegido)
  - [ ] `PUT /api/leads/:id` (protegido)
  - [ ] `DELETE /api/leads/:id` (protegido)
  - [ ] `GET /api/leads/export/csv` (protegido)

### 2.5 Autenticação Simples
- [ ] Criar `AuthService` com login fixo (admin/senha123)
- [ ] Implementar JWT básico
- [ ] Proteger rotas admin

---

## 🎨 FASE 3: FRONTEND - 4 PÁGINAS PRINCIPAIS 

### 3.1 Página 1: Formulário Público (`/`)
  Utilizar o modelo das imagens em planejamento\layout como inspiração para a criação das 4 paginas sempre usando as mesmas cores para uma harmonização do layout.
- [ ] Layout responsivo com Tailwind
- [ ] Formulário com todos os campos obrigatórios
- [ ] Validações em tempo real
- [ ] Máscara para telefone brasileiro
- [ ] Captura de UTMs da URL
- [ ] Envio para API com feedback visual
- [ ] Mensagens de sucesso/erro

### 3.2 Página 2: Login Admin (`/admin/login`)
- [ ] Formulário simples de login
- [ ] Validação de credenciais
- [ ] Armazenar token JWT
- [ ] Redirect para listagem após login
- [ ] Proteção de rotas admin

### 3.3 Página 3: Listagem de Leads (`/admin/leads`)
- [ ] Tabela responsiva com dados básicos
- [ ] Busca por nome/email
- [ ] Paginação simples
- [ ] Botões de ação (ver, editar, deletar)
- [ ] Botão exportar CSV
- [ ] Modal de confirmação para deletar

### 3.4 Página 4: Detalhes do Lead (`/admin/leads/[id]`)
- [ ] Exibir todos os dados do lead
- [ ] Mostrar dados de tracking (UTMs)
- [ ] Botão editar (modal ou página separada)
- [ ] Botão voltar para listagem
- [ ] Botão deletar com confirmação

---

## 🔗 FASE 4: INTEGRAÇÃO E TESTES 

### 4.1 Serviços Frontend
- [ ] Criar `api.ts` para comunicação com backend
- [ ] Implementar interceptors para autenticação
- [ ] Tratamento de erros global

### 4.2 Utilitários
- [ ] Função para capturar UTMs da URL
- [ ] Formatação de telefone e data
- [ ] Validações client-side

### 4.3 Testes Básicos
- [ ] Testar fluxo completo: cadastro → login → listagem → detalhes
- [ ] Verificar validações
- [ ] Testar responsividade mobile
- [ ] Validar exportação CSV

---

## 📊 FASE 5: TRACKING BÁSICO 

### 5.1 Captura de UTMs
- [ ] Implementar captura automática de parâmetros da URL
- [ ] Salvar em localStorage
- [ ] Enviar junto com formulário

### 5.2 Google Tag Manager (Opcional)
- [ ] Criar container GTM básico
- [ ] Implementar dataLayer
- [ ] Configurar eventos: page_view e generate_lead
- [ ] Testar com Tag Assistant

---

## 🚀 FASE 6: DEPLOY E DOCUMENTAÇÃO

### 6.1 Deploy Backend
- [ ] Deploy no Render
- [ ] Configurar variáveis de ambiente
- [ ] Testar endpoints em produção

### 6.2 Deploy Frontend
- [ ] Deploy no Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Testar aplicação online

### 6.3 Documentação Final
- [ ] Atualizar README com:
  - [ ] Instruções de instalação
  - [ ] Links da aplicação
  - [ ] Credenciais de teste
  - [ ] Documentação da API

---

## ✅ CHECKLIST FINAL

### Funcionalidades Core
- [ ] Formulário público funcional
- [ ] Login admin funcionando
- [ ] CRUD completo de leads
- [ ] Exportação CSV
- [ ] Captura de UTMs
- [ ] Responsividade mobile

### Qualidade
- [ ] Validações funcionando
- [ ] Tratamento de erros
- [ ] Feedback visual adequado
- [ ] Código limpo e organizado
- [ ] README completo

### Deploy
- [ ] Backend online
- [ ] Frontend online
- [ ] Aplicação funcionando end-to-end

---

## 📁 ESTRUTURA FINAL

```
/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── leads/
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx (formulário)
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── leads/
│   │   │       ├── page.tsx (listagem)
│   │   │       └── [id]/page.tsx (detalhes)
│   │   └── layout.tsx
│   └── package.json
└── README.md
```

---


**Prioridade:** Focar nas 4 páginas principais e funcionalidades core. Tracking avançado e GTM são opcionais para o MVP.
