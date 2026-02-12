# Technical Audit – Soul-Viagens

**Date:** 2026-02-11
**Angular Version:** 15.2.9 (EOL)
**Backend:** Firebase (Auth, Firestore, Storage)
**Auditor:** Senior Software Architect (AI-assisted)

---

## Critical Issues

### 1. No Lazy Loading – All Feature Modules Eagerly Loaded

- **Issue:** `AuthModule`, `DiariosModule`, `HomeModule`, and `DashboardModule` are all directly imported in `app.module.ts` instead of using `loadChildren` in routes. The entire application is bundled into the initial payload.
- **Impact:** Increased initial bundle size, slower first paint, poor performance on mobile/slow networks.
- **Suggested Direction:** Convert all feature module imports in `app.module.ts` to `loadChildren` in `app-routing.module.ts`. Remove eager imports from `AppModule`. Each feature routing module already exists — wire them as lazy-loaded routes.

### 2. Memory Leaks – Unmanaged Observable Subscriptions

- **Issue:** Multiple components call `.subscribe()` without cleanup: `LoginComponent`, `CadastroComponent`, `NavbarComponent`, `DiarioListComponent`, `RecuperarSenhaComponent`. No `takeUntil`, `DestroyRef`, or manual unsubscribe in `ngOnDestroy`.
- **Impact:** Subscriptions persist after component destruction, causing memory leaks, phantom callbacks, and potential state corruption.
- **Suggested Direction:** Adopt a `DestroyRef` + `takeUntilDestroyed()` pattern (Angular 16+) or a `destroy$` subject with `takeUntil`. Prefer `async` pipe in templates where possible to eliminate manual subscriptions entirely.

### 3. No Firestore Security Rules in Repository

- **Issue:** No `firestore.rules` or `storage.rules` file found in the project. The Firebase API key is public (by design for client SDKs), but without server-side rules, any authenticated — or unauthenticated — user could read/write/delete all data.
- **Impact:** Complete data exposure: unauthorized reads, writes, and deletions of all Firestore collections and Storage files.
- **Suggested Direction:** Create `firestore.rules` and `storage.rules` at project root. Enforce authentication checks, user-scoped document access (`request.auth.uid == resource.data.usuarioId`), and admin-only operations. Deploy rules via Firebase CLI.

### 4. Tests Are Entirely Boilerplate — Zero Behavioral Coverage

- **Issue:** All 24 `.spec.ts` files contain only auto-generated scaffolding (`should create` / `should be created`). No auth flow tests, no guard logic tests, no service interaction tests, no form validation tests. No E2E test infrastructure.
- **Impact:** Zero regression safety. Any change can introduce undetected bugs. No confidence for refactoring or upgrades.
- **Suggested Direction:** Prioritize tests for: (1) `AuthService` login/signup/logout flows, (2) `OnlyAdminGuard` access control, (3) `DiariosService` CRUD operations, (4) form validation in auth components. Add Cypress or Playwright for E2E.

### 5. Angular 15 Is End-of-Life

- **Issue:** Angular 15 reached EOL. The project is 6 major versions behind current (Angular 21). TypeScript 4.9.5 is also outdated.
- **Impact:** No security patches, no bug fixes, growing incompatibility with libraries, inability to use modern features (signals, standalone components, `DestroyRef`, `inject()`).
- **Suggested Direction:** Plan incremental migration: 15 → 16 → 17 → 18+. Use `ng update` for each major version. Angular 16 is the key step (enables standalone components, `DestroyRef`, functional guards). Update `@angular/fire` and `firebase` SDK in tandem.

### 6. Direct DOM Manipulation in Components

- **Issue:** `DiarioListComponent` uses `document.body.classList.add/remove()` for sticky footer toggling. `DiarioAddComponent` uses `document.querySelector('.btnCheck')` for class manipulation.
- **Impact:** Breaks Angular's change detection model, is not SSR-compatible, tightly couples components to DOM structure, and is fragile to template changes.
- **Suggested Direction:** Replace with Angular-native patterns: `@HostBinding('class')`, `[ngClass]` directives, `Renderer2`, or component state bound to template classes.

### 7. No Global Error Handling Strategy

- **Issue:** No HTTP interceptor, no global `ErrorHandler`, no `catchError` operators in service chains. Errors are only handled at the toast level (`HotToastService.observe()`). Failed operations silently disappear.
- **Impact:** Silent failures, no logging, no user recovery paths, no diagnostics for production issues.
- **Suggested Direction:** Implement a custom Angular `ErrorHandler` for uncaught exceptions. Add a Firebase error interceptor service. Add `catchError` + `EMPTY`/retry logic in service Observable chains. Centralize error logging.

### 8. File Upload Has No Validation

- **Issue:** `UploadService` accepts any file without checking type, size, or content. Random filename generation uses only 1000 variants (`Math.random() * 1000`), risking collisions. No error handling on upload failures.
- **Impact:** Users could upload malicious files, oversized files, or non-image content. Filename collisions could overwrite existing files.
- **Suggested Direction:** Add file type whitelist (e.g., `image/jpeg`, `image/png`), enforce max file size (e.g., 5MB), use UUID for filenames, and wrap upload in `catchError` with user feedback.

---

## Important Improvements

### 9. Missing `trackBy` on All `*ngFor` Loops

- **Issue:** At least 7 `*ngFor` loops across `DashboardComponent`, `LastPostsComponent`, `DiarioListComponent`, `HomeComponent`, and `HomeCarouselComponent` lack `trackBy` functions.
- **Impact:** Angular re-renders the entire list on every change detection cycle, causing unnecessary DOM operations and poor performance with larger datasets.
- **Suggested Direction:** Add a `trackBy` function returning `diario.id` (or equivalent unique key) to every `*ngFor` loop.

### 10. Massive SCSS Duplication Across Auth Components

- **Issue:** `login.component.scss` (428 lines), `cadastro.component.scss` (412 lines), and `recuperar-senha.component.scss` (367 lines) share ~80% identical styles: color palette, form fields, buttons, responsive breakpoints, animations.
- **Impact:** Triple maintenance burden. Visual inconsistencies creep in as components diverge. Any design change requires editing 3+ files.
- **Suggested Direction:** Extract shared auth styles into a `_auth-layout.scss` partial. Import it in each component. Alternatively, create an `AuthLayoutComponent` as a wrapper with shared styling.

### 11. Excessive `!important` Usage (24+ Instances)

- **Issue:** Found in `navbar.component.scss` (16 instances), `diario-list.component.scss` (12 instances), `recuperar-senha.component.scss` (9 instances), and `styles.scss` (2 instances). Primarily used to override Angular Material defaults.
- **Impact:** Specificity wars, unmaintainable overrides, blocks future theming, and makes style debugging extremely difficult.
- **Suggested Direction:** Use Angular Material's theming API and `::ng-deep` (scoped) to override component styles properly. Increase selector specificity instead of using `!important`. Define a custom Material theme with project colors.

### 12. No CI/CD Pipeline

- **Issue:** No `.github/workflows`, `gitlab-ci.yml`, or any automated build/test/deploy configuration. Deployment is manual via Firebase CLI.
- **Impact:** No automated quality gates, no regression detection, manual error-prone deployments, no preview environments for PRs.
- **Suggested Direction:** Add a GitHub Actions workflow: lint → test → build → deploy to Firebase Hosting. Use Firebase preview channels for PR previews.

### 13. SCSS Color/Spacing Variables Duplicated Per Component

- **Issue:** Variables like `$accent: #ff6b35`, `$navy: #0f172a`, and spacing values are re-declared in every component SCSS file independently. No global `_variables.scss` or CSS custom properties.
- **Impact:** Color or spacing changes require editing every component file. Risk of palette drift and inconsistency.
- **Suggested Direction:** Create `src/assets/styles/_variables.scss` with all design tokens (colors, spacing, radii, shadows, breakpoints). Import via `stylePreprocessorOptions.includePaths` in `angular.json`. Consider CSS custom properties for runtime theming.

### 14. Unused and Legacy Dependencies

- **Issue:** `cors` and `@types/body-parser` are backend packages — unnecessary in an Angular SPA. `stream-chat-angular` and `stream-chat` appear unused. jQuery is bundled but unnecessary with Angular Material. Bootstrap 4 is legacy.
- **Impact:** Increased bundle size, potential security vulnerabilities from unmaintained packages, confusing dependency graph.
- **Suggested Direction:** Remove `cors`, `@types/body-parser`, `stream-chat-angular`, `stream-chat`. Evaluate removing jQuery (replace with Angular native). Consider migrating from Bootstrap 4 grid to CSS Grid or Angular CDK Layout.

### 15. `DashboardService` Ignores Centralized Constants

- **Issue:** `DashboardService` hardcodes Firestore collection names (`'diarios'`, `'usuarios'`) instead of using `FIRESTORE_COLLECTIONS` from `app.constants.ts`. Also missing `withConverter` for the `usuarios` collection.
- **Impact:** Breaks the single-source-of-truth pattern. If collection names change, this service silently breaks.
- **Suggested Direction:** Replace all hardcoded collection name strings with references to `FIRESTORE_COLLECTIONS`. Apply `DiarioConverter` consistently.

### 16. `OnlyAdminGuard` — Deprecated Pattern and Weak Redirect

- **Issue:** Uses class-based `CanActivate` guard (deprecated in Angular 15.2+, removed in 16+). Redirects non-admins to `/` instead of showing a "not authorized" message. No error handling if the auth check itself fails.
- **Impact:** Will break on Angular 16+ migration. Silent redirect gives no user feedback.
- **Suggested Direction:** Migrate to functional guard pattern (`canActivate: [() => inject(AuthService).isAdmin]`). Add user-facing feedback (toast or redirect to a 403 page). Add `catchError` to handle auth service failures.

### 17. No `OnPush` Change Detection on Any Component

- **Issue:** All components use the default `ChangeDetectionStrategy.Default`. Presentational components (`LoaderComponent`, `LastPostsComponent`, `WeekPostsComponent`, `CommonLocalsComponent`, `FooterComponent`) are ideal candidates for `OnPush`.
- **Impact:** Unnecessary change detection cycles across the entire component tree, degrading runtime performance.
- **Suggested Direction:** Add `changeDetection: ChangeDetectionStrategy.OnPush` to all presentational/stateless components. Ensure inputs are immutable and observables use `async` pipe.

### 18. `DiarioAddComponent` and `DiarioEditComponent` — 95% Template Duplication

- **Issue:** The add and edit dialog templates are nearly identical. Both manage the same form fields, same layout, same validation logic. Only the submit action and title differ.
- **Impact:** Dual maintenance for any form change. Visual inconsistencies between add/edit flows.
- **Suggested Direction:** Create a single `DiarioFormComponent` that accepts a mode (`'add' | 'edit'`) and optional `Diario` data input. Use it inside both dialog wrappers.

---

## Optional Improvements

### 19. Empty `ngOnInit()` Methods in 5 Components

- **Issue:** `LoginComponent`, `CadastroComponent`, `LoaderComponent`, `FooterComponent`, and `HomeComponent` have empty `ngOnInit()` implementations.
- **Impact:** Code noise. Minor, but signals incomplete scaffolding cleanup.
- **Suggested Direction:** Remove empty `ngOnInit()` methods and the `OnInit` interface implementation.

### 20. Inconsistent CSS Spacing, Border-Radius, and Breakpoints

- **Issue:** Spacing uses mixed values (`24px`, `32px`, `16px`). Border-radius varies (`12px`, `14px`, `16px`, `24px`). Responsive breakpoints differ (`600px`, `640px`, `768px`, `900px`, `1024px`).
- **Impact:** Subtle visual inconsistencies across the app. Harder for designers to maintain.
- **Suggested Direction:** Define a spacing scale (`$space-xs: 4px`, `$space-sm: 8px`, ...), radius scale, and breakpoint map in the centralized `_variables.scss`.

### 21. Missing `aria-pressed` on Password Visibility Toggles

- **Issue:** Password show/hide toggle buttons in `CadastroComponent` and `LoginComponent` lack `[attr.aria-pressed]` binding.
- **Impact:** Screen readers cannot communicate toggle state to visually impaired users.
- **Suggested Direction:** Add `[attr.aria-pressed]="showPassword"` to the toggle buttons. Already partially implemented — just missing on some instances.

### 22. No Custom Pipes or Directives

- **Issue:** The project has no custom pipes or directives. Date formatting, text truncation, and conditional styling are handled inline in templates or components.
- **Impact:** Repeated template logic, slightly harder to maintain.
- **Suggested Direction:** Consider creating: a `TruncatePipe` for long text, a `RelativeDatePipe` for "2 days ago" formatting, and an `AutofocusDirective` for form fields.

### 23. `HttpClientModule` Imported but Unused

- **Issue:** `CoreModule` imports `HttpClientModule`, but no service uses Angular's `HttpClient`. All API communication goes through Firebase SDK.
- **Impact:** Unnecessary module import, minor bundle overhead.
- **Suggested Direction:** Remove `HttpClientModule` from `CoreModule` imports unless HTTP calls are planned.

### 24. No Offline Persistence Configuration for Firestore

- **Issue:** Firestore's offline persistence is not explicitly enabled. The app relies entirely on network connectivity.
- **Impact:** App is unusable when offline. No cached reads for previously loaded data.
- **Suggested Direction:** Enable Firestore offline persistence via `enableIndexedDbPersistence()` or `enableMultiTabIndexedDbPersistence()` in the Firebase initialization.

### 25. `toFirestore()` Converter Doesn't Convert Dates Back

- **Issue:** In `DiarioConverter`, `toFirestore()` passes the object as-is without converting `Date` objects to Firestore `Timestamp`. `fromFirestore()` correctly converts `Timestamp` → `Date`, but the reverse path is missing.
- **Impact:** May cause inconsistent date storage depending on Firebase SDK version behavior.
- **Suggested Direction:** In `toFirestore()`, explicitly convert `data` and `createdAt` fields to `Timestamp.fromDate()`.

---

## Architecture Summary

| Area | Status | Priority |
|------|--------|----------|
| Module Architecture | Feature-based, but eagerly loaded | Critical |
| Subscription Management | No cleanup pattern | Critical |
| Security Rules | Missing entirely | Critical |
| Test Coverage | 0% behavioral | Critical |
| Framework Version | EOL (Angular 15) | Critical |
| Error Handling | None centralized | Critical |
| File Upload Security | No validation | Critical |
| DOM Manipulation | Direct DOM access | Critical |
| Performance (trackBy) | Missing everywhere | Important |
| SCSS Architecture | Heavy duplication | Important |
| CI/CD | None | Important |
| Design Tokens | Duplicated per file | Important |
| Dependencies | Unused + legacy | Important |
| Change Detection | Default everywhere | Important |
| Accessibility | Partial coverage | Optional |
| Offline Support | None | Optional |

---

*This report is structured for automated consumption. Each issue is self-contained and actionable without additional context.*
