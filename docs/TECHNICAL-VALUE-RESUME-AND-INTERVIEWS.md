# Soul-Viagens — Valor Técnico para Currículo e Entrevistas

Documento para candidatos que usam o projeto Soul-Viagens (Angular 15, bootcamp) em processos seletivos. Baseado apenas no que existe no repositório.

---

## 1. Tools & Technologies

### Core

| Tecnologia | O que é | Por que é usado | Como aparece no projeto | Problema que resolve |
|------------|---------|-----------------|-------------------------|------------------------|
| **Angular 15** | Framework SPA com TypeScript, componentes, injeção de dependência | Base do bootcamp e da aplicação | Estrutura em módulos (Auth, Core, Shared, Diarios, Dashboard, Home), componentes com template + TS + SCSS | Organização, reuso, testabilidade |
| **TypeScript 4.9** | Superset de JS com tipos e strict mode | Menos erros em tempo de desenvolvimento, melhor refatoração | `strict: true` no `angular.json`, interfaces (ex.: `Diario`, `UserData`) | Tipagem estática, documentação no código |
| **RxJS 7** | Biblioteca de programação reativa (Observables) | Integração com Firebase e Router | `authState()`, `collectionData()`, `docData()`, `router.events`, `pipe(map, switchMap, tap, first)` em services e componentes | Fluxos assíncronos, cancelamento, composição |
| **Angular Reactive Forms** | API de formulários reativos (FormBuilder, FormGroup, validators) | Validação e binding em login, cadastro, recuperar senha, diário | `FormBuilder`, `formControlName`, `Validators.required/email/minLength`, validação custom (ex.: `matchPasswords`) | Validação declarativa e reativa |
| **Angular Router** | Roteamento client-side | Múltiplas telas e fluxos (auth, diários, home, dashboard) | `RouterModule.forRoot/forChild`, rotas com parâmetro (`diarios/:id`), `routerLink`, `Router` injetado para navegação | Navegação SPA e deep linking |

### UI & UX

| Tecnologia | O que é | Por que é usado | Como aparece no projeto | Problema que resolve |
|------------|---------|-----------------|-------------------------|------------------------|
| **Angular Material 15** | Componentes de UI (Material Design) | Padronização e acessibilidade | `MatDialog`, `MatFormField`, `MatButton`, `MatIcon`, `MatTooltip`, `MatDatepicker`, `MatStepper`, tema indigo-pink | UI consistente e acessível |
| **Angular CDK** | Kit de comportamento (layout, overlay, a11y) | Layout responsivo e overlays | `BreakpointObserver`, `Breakpoints.Handset` em diario-list para lógica por viewport | Comportamento reativo sem depender só de CSS |
| **SCSS** | Pré-processador CSS (variáveis, aninhamento, mixins) | Estilos por componente e design system | Variáveis de cor/raio/sombra, `:host`, `:host-context(body.layout-sticky-footer)` para layout condicional | Manutenção de tema e escopo por componente |
| **@ngneat/hot-toast** | Toasts não intrusivos | Feedback de ações (login, criar/editar diário, logout) | `HotToastModule.forRoot()`, `toast.observe({ success, error, loading })` em chamadas de auth e CRUD | Feedback imediato sem bloquear a tela |
| **ngx-pagination** | Paginação para listas | Lista “Todos” com muitos itens | `paginate` no template, `pagina` no componente, `pagination-controls` | Não carregar tudo de uma vez na UI |
| **ngx-captcha** | reCAPTCHA no front | Reduzir bots em login/cadastro | `NgxCaptchaModule`, `ngx-recaptcha2` com `siteKey` nos formulários de auth | Proteção básica em formulários públicos |

### Backend & Data

| Tecnologia | O que é | Por que é usado | Como aparece no projeto | Problema que resolve |
|------------|---------|-----------------|-------------------------|------------------------|
| **Firebase Auth** | Autenticação (email/senha e provedores) | Login/cadastro sem backend próprio | `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup` (Google), `sendEmailVerification`, `sendPasswordResetEmail`, `authState()` | Autenticação e recuperação de senha |
| **Cloud Firestore** | Banco NoSQL em tempo real | Persistência de usuários e diários | `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `collectionData`, `docData` | CRUD e listas em tempo real |
| **Firebase Storage** | Armazenamento de arquivos | Fotos dos diários | `ref`, `uploadBytes`, `getDownloadURL` em `UploadService` | Upload e URL pública das imagens |
| **@angular/fire** | Integração oficial Angular–Firebase | Uso de Auth, Firestore e Storage no ecossistema Angular | `provideFirebaseApp`, `provideAuth`, `provideFirestore`, `provideStorage`, `authState`, `collectionData`, injeção de `Auth`, `Firestore`, `Storage` | Configuração e tipos no Angular |

### Architecture & Quality

| Tecnologia | O que é | Por que é usado | Como aparece no projeto | Problema que resolve |
|------------|---------|-----------------|-------------------------|------------------------|
| **Feature modules** | Módulos por domínio (auth, diarios, etc.) | Separar responsabilidades e rotas | `AuthModule`, `DiariosModule`, `DashboardModule`, `HomeModule`, `CoreModule`, `SharedModule`, cada um com seu routing | Escalabilidade e boundaries claros |
| **Route guards** | Lógica antes de ativar rota | Proteger rotas por autenticação ou perfil | `canActivate(redirectLoggedInTo...)` (Firebase auth-guard) em login/cadastro; `canActivate(redirectUnauthorizedTo...)` em diario/:id; `OnlyAdminGuard` no dashboard | Controle de acesso por rota |
| **Constants** | Valores centralizados | Evitar strings e números soltos | `app.constants.ts`: `ROUTES`, `FIRESTORE_COLLECTIONS`, `STORAGE_PATHS`, `TOAST_MESSAGES`, `VALIDATION` | Manutenção e consistência |
| **Firestore converter** | Serialização/deserialização de documentos | Datas como `Date` no app e Timestamp no Firestore | `DiarioConverter` em `diario.ts`: `toFirestore`/`fromFirestore` para `data` e `createdAt` | Tipagem e datas corretas no front |
| **Karma + Jasmine** | Testes unitários no Angular | Garantir que partes críticas não quebrem | `*.spec.ts` junto dos componentes e services, config em `karma.conf.js` | Regressão e documentação viva |

Outros presentes no projeto: **Bootstrap 4**, **jQuery**, **date-fns**, **ng2-charts**, **chart.js**, **@ngx-translate/core**, **stream-chat-angular** (dependências no `package.json`; uso real pode ser parcial ou legado).

---

## 2. Concepts & Patterns

### Reactive state with Observables

- **O que é:** Estado e efeitos colaterais modelados como streams (Observables) em vez de callbacks ou estado mutável solto.
- **Por que:** Firebase e Router são assíncronos; RxJS permite compor e cancelar fluxos.
- **No projeto:** `AuthService.logged` (authState), `DiariosService.getTodosDiarios()` / `getDiariosUsuario()` (collectionData), `getDiarioById` (docData). Componentes usam `async` pipe ou assinam no template/TS. `diario-list` usa `allDiarios$` e `meusDiarios$` com `async` e `*ngIf="diarios; else loading"`.
- **Problema:** Evitar race conditions e vazamento de memória ao trocar de rota/aba, e manter UI alinhada com o backend.

### Service layer and single responsibility

- **O que é:** Lógica de negócio e acesso a dados em services injetáveis; componentes focados em UI e eventos.
- **Por que:** Reuso, testes e separação clara de responsabilidades.
- **No projeto:** `AuthService` (auth + perfil Firestore), `DiariosService` (CRUD diários + dependência de auth e upload), `UploadService` (Storage). Componentes chamam os services e reagem aos Observables.
- **Problema:** Centralizar regras e dados em um lugar, facilitando mudanças de backend ou de fluxo.

### Route-based layout (conditional shell)

- **O que é:** Navbar e footer exibidos ou ocultos conforme a rota.
- **Por que:** Telas de login/cadastro sem shell; resto da app com shell.
- **No projeto:** `AppComponent` usa `router.events` (NavigationEnd) + `startWith` para definir `showLayout$` e esconder navbar/footer em rotas de auth.
- **Problema:** UX adequada por contexto (auth vs app logada) sem duplicar layout em cada página.

### Guard-based access control

- **O que é:** Guards decidem se uma rota pode ser ativada (e redirecionam se não).
- **Por que:** Proteger rotas por autenticação ou papel (ex.: admin).
- **No projeto:** Firebase `redirectLoggedInTo(['/diarios'])` em login/cadastro; `redirectUnauthorizedTo(['/login'])` em diario detail; `OnlyAdminGuard` (baseado em `AuthService.isAdmin`) no dashboard.
- **Problema:** Impedir acesso não autorizado e redirecionar de forma centralizada.

### Form validation (reactive + custom)

- **O que é:** Validação declarativa (required, email, minLength) e validadores custom (ex.: senhas iguais).
- **Por que:** Feedback imediato e evitar submit inválido.
- **No projeto:** Login/cadastro com `Validators.required/email/minLength(8)`; cadastro com `matchPasswords` no FormGroup; mensagens com `mat-error` e `*ngIf` nos erros.
- **Problema:** Menos dados inválidos e melhor UX em formulários.

### Modal flows (MatDialog)

- **O que é:** Fluxos secundários (criar/editar/ver diário) em dialogs em vez de novas páginas.
- **Por que:** Manter contexto (lista) e reduzir navegação.
- **No projeto:** `DiarioListComponent` abre `DiarioAddComponent`, `DiarioEditComponent` e `DiarioDetailComponent` via `MatDialog.open()`, com `data`, `panelClass`, e `afterClosed().subscribe()` para refresh ou toasts.
- **Problema:** CRUD e leitura sem sair da tela de listagem.

### Shared and reusable pieces

- **O que é:** Componentes e módulos compartilhados entre features (loader, Material, guards).
- **Por que:** Evitar duplicação e manter consistência.
- **No projeto:** `SharedModule` com `LoaderComponent`; `MaterialModule` (barrel de Material/CDK); `CoreModule` com navbar/footer; guards em `shared/guards`.
- **Problema:** Um único lugar para mudar comportamento ou estilo global.

### Responsive and layout logic

- **O que é:** Comportamento e layout que mudam por viewport ou estado (ex.: aba “Meus” vs “Todos”).
- **No projeto:** `BreakpointObserver` em diario-list; layout “sticky footer” só na aba “Meus Diários” via classe no `body` e `:host-context` no SCSS; uso de flex/grid e media queries.
- **Problema:** Boa experiência em mobile e desktop e layouts diferentes por contexto.

---

## 3. Resume Bullet Points

Use 2–4 destes no currículo; escolha os que combinam com a vaga.

- Desenvolvimento de aplicação **Angular 15** (TypeScript) com **autenticação** (Firebase Auth), **Firestore** e **Storage**, incluindo login por e-mail e Google, cadastro, recuperação de senha e verificação de e-mail.
- Implementação de **CRUD de diários** com listagem (pública e por usuário), criação/edição em **modais** (Angular Material Dialog), upload de imagens para Firebase Storage e paginação no feed.
- Uso de **Reactive Forms** com validação (incl. custom) e **RxJS** (Observables, pipe, switchMap) para estado assíncrono e integração com Firebase e Router.
- Arquitetura em **módulos por feature** (Auth, Diarios, Dashboard, Home, Core, Shared), **route guards** (auth e admin) e **constantes centralizadas** para rotas, coleções e mensagens.
- Interface com **Angular Material** e **CDK** (BreakpointObserver), **toasts** para feedback, **reCAPTCHA** em formulários de auth e estilos com **SCSS** e design system (variáveis, responsividade).
- Persistência com **Firestore** usando **converters** para tipagem e datas; serviços de auth, diários e upload com responsabilidades bem definidas.

---

## 4. Interview Narratives

### “Conte sobre um projeto que você fez com Angular”

> “No bootcamp, desenvolvemos em grupo o Soul-Viagens, uma aplicação de diários de viagem em Angular 15. O usuário faz login com e-mail ou Google, cria e edita diários com título, texto, local, data e foto. O feed mostra todos os diários com paginação e há uma aba ‘Meus Diários’ filtrada por usuário. Usamos Firebase para autenticação, Firestore para os dados e Storage para as imagens. O front é organizado em módulos por feature — Auth, Diarios, Dashboard, Home — e um Core com navbar e footer e um Shared com loader e Material. As rotas de login e cadastro redirecionam quem já está logado; a rota de detalhe do diário exige autenticação; o dashboard exige admin, com um guard que lê o perfil no Firestore.”

### “Como vocês lidaram com dados assíncronos?”

> “Quase tudo que vem do Firebase ou do Router é Observable. O AuthService expõe `logged` (authState) e `userData` (doc do usuário no Firestore). O DiariosService expõe `getTodosDiarios()` e `getDiariosUsuario()`, que usam `collectionData` e, no caso de ‘meus diários’, fazem `switchMap` a partir do `logged` para pegar o uid. Nos componentes usamos o `async` pipe no template para não precisar gerenciar subscribe manualmente e para o Angular desinscrever sozinho. Quando precisamos encadear ações — por exemplo, criar diário depois de pegar o userData e fazer o upload da imagem — usamos `switchMap` nos services e retornamos um único Observable para o componente assinar ou para o toast observar.”

### “Qual foi uma decisão técnica importante no projeto?”

> “Duas que eu destacaria: a primeira foi usar Firestore converters para os diários. As datas no Firestore vêm como Timestamp e queríamos usar `Date` no TypeScript e no template (pipe date). O converter faz essa conversão no `fromFirestore` e mantém o tipo certo em todo o app. A segunda foi separar o layout por rota: nas telas de login e cadastro não mostramos navbar e footer; no restante da app, sim. Isso foi feito no AppComponent com um Observable que reage ao Router (NavigationEnd) e define se o layout deve aparecer, evitando lógica espalhada em cada tela.”

### “O que você faria diferente em um ambiente de produção?”

> “Hoje não temos lazy loading: todos os módulos são carregados no bootstrap. Em produção eu lazy loadaria Auth, Diarios e Dashboard para reduzir o bundle inicial. Também não há tratamento global de erros de rede ou interceptors HTTP; como a maior parte das chamadas é via Firebase SDK, isso seria complementado com tratamento de erro nos Observables e, se houver APIs próprias, um interceptor para token e mensagens. Por fim, os testes estão em spec mas não são muitos; eu priorizaria testes nos services de auth e diários e em guards, que são o coração da aplicação.”

---

## 5. Improvement Opportunities (se fosse produção)

- **Lazy loading:** `loadChildren` para Auth, Diarios e Dashboard para diminuir o initial bundle.
- **Error handling:** Tratamento explícito de erro nos Observables (retry, mensagens por tipo) e, se existir API REST, um HTTP interceptor para erros e auth.
- **Security rules:** Garantir que Firestore e Storage tenham regras revisadas (por exemplo, diários só editáveis pelo dono, leitura pública controlada).
- **Tests:** Aumentar cobertura em `AuthService`, `DiariosService`, `UploadService` e guards; testes de integração para fluxos críticos (login, criar diário).
- **State:** Para estado global além do auth (ex.: preferências, filtros), considerar um padrão (serviço singleton, ou NgRx/Signals no futuro) em vez de repassar muitos inputs.
- **Accessibility:** Revisar labels, roles e foco em modais e formulários; garantir contraste e uso de Material acessível.
- **i18n:** Se o app for multilíngue, usar de fato o @ngx-translate (ou Angular i18n) com chaves e arquivos de tradução.
- **Cleanup:** Remover ou isolar dependências não usadas (Bootstrap/jQuery, stream-chat, etc.) para reduzir tamanho e confusão.

---

## 6. Honest positioning (Junior → Mid)

- **O projeto mostra:** Uso de Angular (components, modules, routing, reactive forms), RxJS em cenários reais, integração com Firebase (Auth, Firestore, Storage), uso de Material e padrões como services, guards e constantes. Boa base para discutir em entrevistas de nível júnior/estágio e início de pleno.
- **Não foi feito (e não deve ser inventado):** Lazy loading, NgRx ou estado global complexo, interceptors, testes automatizados robustos, CI/CD, deploy configurado no repositório. Esses são bons temas para “o que eu faria na próxima iteração”.
- **Como falar na entrevista:** Ser direto: “É um projeto de bootcamp, em grupo; nós implementamos X e Y; hoje eu mudaria Z para produção.” Isso transmite autocrítica e noção de ciclo de vida de software.
