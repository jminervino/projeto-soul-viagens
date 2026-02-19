# Soul Viagens

Aplicação web em Angular para registro e compartilhamento de diários de viagem, com autenticação Firebase, CRUD de diários, upload de imagens e dashboard administrativo.

## Visão geral

O projeto é organizado por módulos de feature com lazy loading:

- `home`: landing page pública.
- `auth`: login, cadastro, recuperação de senha e telas de verificação/termos.
- `diarios`: listagem, detalhes e gerenciamento de diários.
- `dashboard`: área administrativa com métricas e gráficos.

Também possui:

- `core`: serviços e componentes globais (navbar, footer, auth, diários, upload, dashboard).
- `shared`: componentes/módulos reutilizáveis (loader, material module, guards).

## Stack

- Angular `15.2.x`
- TypeScript `4.9.x`
- RxJS `7.5.x`
- Angular Material
- Firebase + AngularFire (Auth, Firestore, Storage)
- SCSS
- ng2-charts + Chart.js
- Hot Toast (`@ngneat/hot-toast`)
- Jasmine + Karma (testes unitários)

## Arquitetura (resumo)

```text
src/app
├── core
│   ├── components (navbar, footer)
│   ├── services (auth, diarios, dashboard, upload)
│   ├── models
│   └── constants
├── shared
│   ├── components (loader)
│   ├── guards (only-admin.guard.ts)
│   └── material.module.ts
├── auth
├── home
├── diarios
└── dashboard
```

## Rotas principais

As rotas de feature são lazy-loaded em `app-routing.module.ts`.

- `/home`
- `/auth/login`
- `/auth/cadastro`
- `/auth/recuperar-senha`
- `/auth/confirmar-email`
- `/auth/termos-de-privacidade`
- `/diarios`
- `/diarios/:id`
- `/dashboard`

Também existem redirecionamentos de compatibilidade:

- `/login` -> `/auth/login`
- `/cadastro` -> `/auth/cadastro`
- `/recuperar-senha` -> `/auth/recuperar-senha`
- `/confirmar-email` -> `/auth/confirmar-email`
- `/termos-de-privacidade` -> `/auth/termos-de-privacidade`

## Autenticação e autorização

### Autenticação

Implementada via Firebase Auth com:

- email/senha
- Google

Fluxos suportados:

- cadastro
- login
- recuperação de senha
- verificação de email

### Autorização

- Rotas de diários exigem usuário autenticado.
- Rota `/dashboard` é restrita a admin por guard.
- Regra de admin baseada no campo `isAdmin: true` no documento do usuário na coleção `usuarios` (Firestore).

## Funcionalidades

- Cadastro, login e logout.
- Recuperação de senha.
- Criação, edição, exclusão e leitura de diários.
- Upload de imagem para diários.
- Listagem paginada de diários.
- Dashboard admin com:
  - total de posts
  - total de usuários
  - postagens da semana
  - destinos mais visitados
  - últimos posts

## Como rodar localmente

### Pré-requisitos

- Node.js 16+ (recomendado para Angular 15)
- npm

### Instalação

```bash
npm install
```

### Ambiente

As chaves do Firebase estão em:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

### Execução

```bash
npm start
```

App disponível em:

- `http://localhost:4200` (ou porta indicada no terminal)

## Scripts

```bash
# dev server
npm start

# build
npm run build

# build watch (dev)
npm run watch

# testes unitários
npm test
```

## Testes

- Framework: Jasmine
- Runner: Karma
- Configuração: `karma.conf.js`

Para executar:

```bash
npm test
```

## Padrões adotados

- Lazy loading para módulos de feature.
- Uso de `async` pipe em templates quando possível.
- Guards para proteção de rota.
- Separação clara entre `core`, `shared` e features.
- Reutilização de estilos no auth via partial (`src/app/auth/_auth-layout.scss`).

## Melhorias recentes relevantes

- Migração de módulos para lazy loading.
- Adoção de `trackBy` em listas com `*ngFor`.
- Redução de duplicação no formulário de diário (`DiarioFormComponent`).
- Adoção de `OnPush` em componentes presentacionais.
- Guard admin atualizado para padrão funcional.

## Contribuição
- Cicero Gomes
- João Victor Minervino
- Gabriele Sabrine
- Alexandre Mercador
- Tony Kerisleyk 
- Elaine Brito

Se for contribuir:

1. Crie uma branch de feature.
2. Faça alterações pequenas e focadas.
3. Rode `npm test` antes de enviar.
4. Garanta que rotas protegidas e fluxo de auth não foram quebrados.

## Licença

Uso acadêmico/estudo (ajuste esta seção conforme a licença oficial do projeto).
