# Auditoria Técnica – Soul-Viagens

**Data:** 11/02/2026  
**Versão do Angular:** 15.2.9 (EOL)  
**Backend:** Firebase (Auth, Firestore, Storage)  
**Auditor:** Arquiteto de Software Sênior (com assistência de IA)

---

## Problemas Críticos

### 1. Sem Lazy Loading – Todos os Módulos de Feature Carregados de Forma Eager

<!-- - **Problema:** `AuthModule`, `DiariosModule`, `HomeModule` e `DashboardModule` são importados diretamente em `app.module.ts` em vez de usar `loadChildren` nas rotas. Toda a aplicação vai no bundle inicial.
- **Impacto:** Bundle inicial maior, first paint mais lento, pior desempenho em mobile e redes lentas.
- **Sugestão:** Trocar as importações dos feature modules em `app.module.ts` por rotas com `loadChildren` em `app-routing.module.ts`. Remover as importações eager do `AppModule`. Os módulos de roteamento já existem — basta configurá-los como rotas lazy-loaded. -->

### 2. Vazamento de Memória – Assinaturas de Observable sem Limpeza

<!-- - **Problema:** Vários componentes chamam `.subscribe()` sem cleanup: `LoginComponent`, `CadastroComponent`, `NavbarComponent`, `DiarioListComponent`, `RecuperarSenhaComponent`. Não há `takeUntil`, `DestroyRef` nem `unsubscribe` manual em `ngOnDestroy`.
- **Impacto:** Assinaturas continuam após a destruição do componente, causando vazamento de memória, callbacks fantasmas e possível corrupção de estado.
- **Sugestão:** Adotar o padrão `DestroyRef` + `takeUntilDestroyed()` (Angular 16+) ou um subject `destroy$` com `takeUntil`. Preferir o `async` pipe nos templates quando possível para evitar assinaturas manuais. -->

### 3. Regras de Segurança do Firestore Ausentes no Repositório

- **Problema:** Não há arquivos `firestore.rules` ou `storage.rules` no projeto. A API key do Firebase é pública (por design nos SDKs clientes), mas sem regras no servidor qualquer usuário autenticado — ou não autenticado — pode ler/escrever/apagar todos os dados.
- **Impacto:** Exposição total dos dados: leitura, escrita e exclusão não autorizadas de todas as coleções do Firestore e arquivos do Storage.
- **Sugestão:** Criar `firestore.rules` e `storage.rules` na raiz do projeto. Garantir checagem de autenticação, acesso por usuário (`request.auth.uid == resource.data.usuarioId`) e operações restritas a admin. Fazer deploy das regras via Firebase CLI.

### 4. Testes Apenas Boilerplate – Nenhuma Cobertura de Comportamento

- **Problema:** Os 24 arquivos `.spec.ts` contêm só o scaffold gerado automaticamente (`should create` / `should be created`). Não há testes de fluxo de auth, de guards, de serviços, nem de validação de formulários. Nenhuma infraestrutura de E2E.
- **Impacto:** Nenhuma proteção contra regressão. Qualquer mudança pode introduzir bugs não detectados. Sem confiança para refatorar ou atualizar.
- **Sugestão:** Priorizar testes para: (1) fluxos de login/signup/logout do `AuthService`, (2) controle de acesso do `OnlyAdminGuard`, (3) operações CRUD do `DiariosService`, (4) validação de formulários nos componentes de auth. Adicionar Cypress ou Playwright para E2E.

### 5. Angular 15 Está em End-of-Life

- **Problema:** O Angular 15 já atingiu o fim de vida. O projeto está 6 versões major atrás da atual (Angular 21). O TypeScript 4.9.5 também está desatualizado.
- **Impacto:** Sem patches de segurança, sem correções de bugs, incompatibilidade crescente com bibliotecas, impossibilidade de usar recursos modernos (signals, standalone components, `DestroyRef`, `inject()`).
- **Sugestão:** Planejar migração incremental: 15 → 16 → 17 → 18+. Usar `ng update` em cada versão major. Angular 16 é o passo chave (habilita standalone components, `DestroyRef`, guards funcionais). Atualizar `@angular/fire` e o SDK do Firebase em conjunto.

### 6. Manipulação Direta do DOM nos Componentes

- **Problema:** `DiarioListComponent` usa `document.body.classList.add/remove()` para alternar o sticky footer. `DiarioAddComponent` usa `document.querySelector('.btnCheck')` para manipular classe.
- **Impacto:** Quebra o modelo de change detection do Angular, não é compatível com SSR, acopla os componentes à estrutura do DOM e fica frágil a mudanças no template.
- **Sugestão:** Substituir por padrões nativos do Angular: `@HostBinding('class')`, diretiva `[ngClass]`, `Renderer2` ou estado do componente ligado a classes no template.

### 7. Nenhuma Estratégia Global de Tratamento de Erros

- **Problema:** Não há interceptor HTTP, nem `ErrorHandler` global, nem operadores `catchError` nas cadeias de serviços. Erros são tratados só no nível do toast (`HotToastService.observe()`). Operações que falham somem em silêncio.
- **Impacto:** Falhas silenciosas, sem logging, sem caminhos de recuperação para o usuário, sem diagnóstico em produção.
- **Sugestão:** Implementar um `ErrorHandler` customizado para exceções não capturadas. Adicionar um serviço interceptor para erros do Firebase. Usar `catchError` + `EMPTY`/retry nas cadeias de Observable dos serviços. Centralizar logging de erros.

### 8. Upload de Arquivo sem Validação

- **Problema:** O `UploadService` aceita qualquer arquivo sem checar tipo, tamanho ou conteúdo. A geração de nome usa só 1000 variantes (`Math.random() * 1000`), com risco de colisão. Não há tratamento de erro em falha de upload.
- **Impacto:** Usuários podem enviar arquivos maliciosos, muito grandes ou que não são imagem. Colisões de nome podem sobrescrever arquivos existentes.
- **Sugestão:** Definir whitelist de tipo (ex.: `image/jpeg`, `image/png`), limite máximo de tamanho (ex.: 5MB), usar UUID para nomes de arquivo e envolver o upload em `catchError` com feedback ao usuário.

---

## Melhorias Importantes

### 9. Falta de `trackBy` em Todos os `*ngFor`

<!-- - **Problema:** Pelo menos 7 loops `*ngFor` em `DashboardComponent`, `LastPostsComponent`, `DiarioListComponent`, `HomeComponent` e `HomeCarouselComponent` não usam função `trackBy`.
- **Impacto:** O Angular re-renderiza a lista inteira a cada ciclo de change detection, gerando operações desnecessárias no DOM e pior desempenho com mais dados.
- **Sugestão:** Adicionar uma função `trackBy` que retorne `diario.id` (ou chave única equivalente) em todo `*ngFor`. -->

### 10. Grande Duplicação de SCSS nos Componentes de Auth

<!-- - **Problema:** `login.component.scss` (428 linhas), `cadastro.component.scss` (412 linhas) e `recuperar-senha.component.scss` (367 linhas) compartilham ~80% dos estilos: paleta, campos de formulário, botões, breakpoints responsivos, animações.
- **Impacto:** Manutenção triplicada. Inconsistências visuais conforme os componentes divergem. Qualquer mudança de design exige editar 3+ arquivos.
- **Sugestão:** Extrair estilos comuns para um partial `_auth-layout.scss`. Importá-lo em cada componente. Alternativamente, criar um `AuthLayoutComponent` como wrapper com estilos compartilhados. -->

### 11. Uso Excessivo de `!important` (24+ Ocorrências)

- **Problema:** Encontrado em `navbar.component.scss` (16), `diario-list.component.scss` (12), `recuperar-senha.component.scss` (9) e `styles.scss` (2). Usado principalmente para sobrescrever padrões do Angular Material.
- **Impacto:** Guerra de especificidade, overrides difíceis de manter, bloqueia theming futuro e dificulta o debug de estilos.
- **Sugestão:** Usar a API de theming do Angular Material e `::ng-deep` (escopado) para sobrescrever estilos de componentes. Aumentar a especificidade do seletor em vez de `!important`. Definir um tema Material customizado com as cores do projeto.

### 12. Nenhum Pipeline de CI/CD

- **Problema:** Não há `.github/workflows`, `gitlab-ci.yml` nem qualquer configuração automatizada de build/test/deploy. O deploy é manual via Firebase CLI.
- **Impacto:** Sem gates de qualidade automáticos, sem detecção de regressão, deploys manuais e propensos a erro, sem ambientes de preview para PRs.
- **Sugestão:** Adicionar um workflow no GitHub Actions: lint → test → build → deploy no Firebase Hosting. Usar canais de preview do Firebase para previews de PR.

### 13. Variáveis de Cor/Espaçamento em SCSS Duplicadas por Componente

- **Problema:** Variáveis como `$accent: #ff6b35`, `$navy: #0f172a` e valores de espaçamento são redeclaradas em cada arquivo SCSS de componente. Não há `_variables.scss` global nem custom properties em CSS.
- **Impacto:** Mudanças de cor ou espaçamento exigem editar vários arquivos. Risco de deriva da paleta e inconsistência.
- **Sugestão:** Criar `src/assets/styles/_variables.scss` com todos os design tokens (cores, espaçamento, raios, sombras, breakpoints). Importar via `stylePreprocessorOptions.includePaths` no `angular.json`. Considerar custom properties para theming em runtime.

### 14. Dependências Não Usadas e Legadas

<!-- - **Problema:** `cors` e `@types/body-parser` são pacotes de backend — desnecessários em um SPA Angular. `stream-chat-angular` e `stream-chat` parecem não usados. jQuery está no bundle mas é desnecessário com Angular Material. Bootstrap 4 é legado.
- **Impacto:** Bundle maior, possíveis vulnerabilidades de pacotes sem manutenção, grafo de dependências confuso.
- **Sugestão:** Remover `cors`, `@types/body-parser`, `stream-chat-angular`, `stream-chat`. Avaliar remoção do jQuery (substituir por recursos nativos do Angular). Considerar migrar o grid do Bootstrap 4 para CSS Grid ou Angular CDK Layout. -->

### 15. `DashboardService` Ignora Constantes Centralizadas

- **Problema:** O `DashboardService` usa nomes de coleções do Firestore hardcoded (`'diarios'`, `'usuarios'`) em vez de `FIRESTORE_COLLECTIONS` de `app.constants.ts`. Também não usa `withConverter` na coleção `usuarios`.
- **Impacto:** Quebra o padrão de fonte única de verdade. Se os nomes das coleções mudarem, o serviço quebra em silêncio.
- **Sugestão:** Trocar todas as strings de nome de coleção por referências a `FIRESTORE_COLLECTIONS`. Aplicar `DiarioConverter` de forma consistente.

### 16. `OnlyAdminGuard` – Padrão Depreciado e Redirect Fraco

- **Problema:** Usa guard class-based `CanActivate` (depreciado no Angular 15.2+, removido no 16+). Redireciona não-admins para `/` em vez de mostrar mensagem de “não autorizado”. Sem tratamento de erro se a própria checagem de auth falhar.
- **Impacto:** Vai quebrar na migração para Angular 16+. Redirect silencioso não dá feedback ao usuário.
- **Sugestão:** Migrar para o padrão de guard funcional (`canActivate: [() => inject(AuthService).isAdmin]`). Dar feedback ao usuário (toast ou redirect para página 403). Adicionar `catchError` para falhas do serviço de auth.

### 17. Nenhum Componente com `OnPush` Change Detection

<!-- - **Problema:** Todos os componentes usam `ChangeDetectionStrategy.Default`. Componentes de apresentação (`LoaderComponent`, `LastPostsComponent`, `WeekPostsComponent`, `CommonLocalsComponent`, `FooterComponent`) são bons candidatos a `OnPush`.
- **Impacto:** Ciclos de change detection desnecessários em toda a árvore de componentes, piorando desempenho.
- **Sugestão:** Usar `changeDetection: ChangeDetectionStrategy.OnPush` em componentes presentacionais/stateless. Garantir que inputs sejam imutáveis e que observables usem `async` pipe. -->

### 18. `DiarioAddComponent` e `DiarioEditComponent` – 95% do Template Duplicado
<!-- 
- **Problema:** Os templates dos diálogos de adicionar e editar são quase idênticos. Ambos têm os mesmos campos, layout e validação. Só mudam a ação de submit e o título.
- **Impacto:** Manutenção duplicada para qualquer alteração no formulário. Risco de inconsistência entre os fluxos.
- **Sugestão:** Criar um único `DiarioFormComponent` que receba modo (`'add' | 'edit'`) e opcionalmente os dados do `Diario`. Usá-lo nos dois wrappers de diálogo. -->

---

## Melhorias Opcionais

### 19. Métodos `ngOnInit()` Vazios em 5 Componentes

- **Problema:** `LoginComponent`, `CadastroComponent`, `LoaderComponent`, `FooterComponent` e `HomeComponent` têm `ngOnInit()` vazios.
- **Impacto:** Ruído no código. Pequeno, mas indica scaffold não limpo.
- **Sugestão:** Remover os `ngOnInit()` vazios e a implementação da interface `OnInit`.

### 20. Espaçamento, Border-Radius e Breakpoints Inconsistentes em CSS

- **Problema:** Espaçamento mistura valores (`24px`, `32px`, `16px`). Border-radius varia (`12px`, `14px`, `16px`, `24px`). Breakpoints responsivos diferentes (`600px`, `640px`, `768px`, `900px`, `1024px`).
- **Impacto:** Pequenas inconsistências visuais. Mais difícil para designers manter.
- **Sugestão:** Definir escala de espaçamento (`$space-xs: 4px`, `$space-sm: 8px`, …), escala de raio e mapa de breakpoints no `_variables.scss` centralizado.

### 21. Falta de `aria-pressed` nos Botões de Mostrar/Ocultar Senha

- **Problema:** Os botões de mostrar/ocultar senha em `CadastroComponent` e `LoginComponent` não têm binding `[attr.aria-pressed]`.
- **Impacto:** Leitores de tela não comunicam o estado do toggle para usuários com deficiência visual.
- **Sugestão:** Adicionar `[attr.aria-pressed]="showPassword"` nos botões. Já está parcialmente implementado — falta em alguns casos.

### 22. Nenhum Pipe ou Diretiva Customizada

- **Problema:** O projeto não tem pipes nem diretivas customizadas. Formatação de data, truncamento de texto e estilos condicionais são feitos inline nos templates ou nos componentes.
- **Impacto:** Lógica repetida no template, manutenção um pouco mais difícil.
- **Sugestão:** Considerar criar: um `TruncatePipe` para texto longo, um `RelativeDatePipe` para “há 2 dias” e uma `AutofocusDirective` para campos de formulário.

### 23. `HttpClientModule` Importado mas Não Usado

- **Problema:** O `CoreModule` importa `HttpClientModule`, mas nenhum serviço usa o `HttpClient` do Angular. Toda a comunicação de API é via SDK do Firebase.
- **Impacto:** Import desnecessário, pequeno custo no bundle.
- **Sugestão:** Remover `HttpClientModule` dos imports do `CoreModule` a menos que haja plano de chamadas HTTP.

### 24. Nenhuma Configuração de Persistência Offline para o Firestore

- **Problema:** A persistência offline do Firestore não está habilitada explicitamente. O app depende totalmente da rede.
- **Impacto:** App inutilizável offline. Sem leituras em cache para dados já carregados.
- **Sugestão:** Habilitar persistência offline do Firestore com `enableIndexedDbPersistence()` ou `enableMultiTabIndexedDbPersistence()` na inicialização do Firebase.

### 25. O Converter `toFirestore()` Não Converte Datas de Volta

- **Problema:** No `DiarioConverter`, `toFirestore()` repassa o objeto sem converter `Date` para `Timestamp` do Firestore. O `fromFirestore()` converte corretamente `Timestamp` → `Date`, mas o caminho inverso não existe.
- **Impacto:** Pode gerar armazenamento inconsistente de datas conforme o comportamento da versão do SDK.
- **Sugestão:** Em `toFirestore()`, converter explicitamente os campos `data` e `createdAt` para `Timestamp.fromDate()`.

---

## Resumo da Arquitetura

| Área | Status | Prioridade |
|------|--------|------------|
| Arquitetura de Módulos | Por feature, mas eager loaded | Crítica |
| Gestão de Assinaturas | Sem padrão de cleanup | Crítica |
| Regras de Segurança | Ausentes | Crítica |
| Cobertura de Testes | 0% comportamental | Crítica |
| Versão do Framework | EOL (Angular 15) | Crítica |
| Tratamento de Erros | Nenhum centralizado | Crítica |
| Segurança de Upload | Sem validação | Crítica |
| Manipulação de DOM | Acesso direto | Crítica |
| Performance (trackBy) | Ausente em todo lugar | Importante |
| Arquitetura SCSS | Muita duplicação | Importante |
| CI/CD | Nenhum | Importante |
| Design Tokens | Duplicados por arquivo | Importante |
| Dependências | Não usadas + legadas | Importante |
| Change Detection | Default em todo lugar | Importante |
| Acessibilidade | Cobertura parcial | Opcional |
| Suporte Offline | Nenhum | Opcional |

---

*Este relatório está estruturado para consumo automatizado. Cada item é autocontido e acionável sem contexto adicional.*
