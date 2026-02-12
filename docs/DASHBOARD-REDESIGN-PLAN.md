# Dashboard Redesign Plan — Soul Viagens

**Scope:** Visual and UX only. No business logic changes. No chart library changes.
**Design system:** Use existing CSS custom properties from `src/styles.scss` `:root`.

---

## Current State Assessment

The dashboard has partial modernization (BEM naming, KPI stat cards, design tokens). Three structural problems remain:

1. **`mat-grid-list` with `::ng-deep` + `!important` hacks** — rigid `rowHeight: 400px`, absolute positioning artifacts, 6 `!important` overrides to fight Material internals
2. **`BreakpointObserver` in TypeScript** drives layout — CSS Grid handles this natively
3. **Child components lack polish** — no chart branding, no empty states, flat last-posts list

---

## Step 1 — Replace `mat-grid-list` with CSS Grid

### 1A. Rewrite template structure

**File:** `src/app/dashboard/dashboard.component.html`

Replace the entire `<section class="dashboard__grid">` block (lines 32-62) with static semantic HTML. Remove `*ngFor`, `ngSwitch`, and all `mat-grid-*` elements:

```html
<section class="dashboard__grid" aria-label="Widgets">
  <article class="widget-card widget-card--wide">
    <header class="widget-card__header">
      <mat-icon class="widget-card__icon" aria-hidden="true">bar_chart</mat-icon>
      <div class="widget-card__header-text">
        <h2 class="widget-card__title">Postagens da Semana</h2>
        <p class="widget-card__description">Distribuicao por dia da semana atual</p>
      </div>
    </header>
    <div class="widget-card__body">
      <app-week-posts></app-week-posts>
    </div>
  </article>

  <article class="widget-card">
    <header class="widget-card__header">
      <mat-icon class="widget-card__icon" aria-hidden="true">pie_chart</mat-icon>
      <div class="widget-card__header-text">
        <h2 class="widget-card__title">Destinos Mais Visitados</h2>
        <p class="widget-card__description">Top destinos registrados</p>
      </div>
    </header>
    <div class="widget-card__body">
      <app-common-locals></app-common-locals>
    </div>
  </article>

  <article class="widget-card">
    <header class="widget-card__header">
      <mat-icon class="widget-card__icon" aria-hidden="true">history</mat-icon>
      <div class="widget-card__header-text">
        <h2 class="widget-card__title">Ultimos Posts</h2>
        <p class="widget-card__description">5 publicacoes mais recentes</p>
      </div>
    </header>
    <div class="widget-card__body">
      <app-last-posts></app-last-posts>
    </div>
  </article>
</section>
```

Key changes:
- 3 static `<article>` elements replace the dynamic `*ngFor` + `ngSwitch`
- Each card gets a `.widget-card__description` subtitle
- First card gets modifier `.widget-card--wide` for 2-column span
- Titles moved from TS data to template (static content belongs in HTML)

### 1B. Simplify component TypeScript

**File:** `src/app/dashboard/dashboard.component.ts`

Remove from the component class:
- The `cards` property (entire `this.breakpointObserver.observe(...)` pipe, lines 17-43)
- The `trackByCardId` method (lines 50-52)
- The `BreakpointObserver` constructor parameter
- Imports: `Breakpoints`, `BreakpointObserver` from `@angular/cdk/layout`, `map` from `rxjs/operators`

The component should only contain:
```
totalPosts$?: Observable<number>
usuarioTotal$?: Observable<number>
constructor(private dashboardService: DashboardService) {}
ngOnInit() → same two service calls
```

### 1C. Replace grid SCSS

**File:** `src/app/dashboard/dashboard.component.scss`

Delete these blocks entirely:
- `.dashboard__grid-list` (lines 149-152) — the `!important` overrides
- `::ng-deep .dashboard-tile` (lines 154-163) — the `!important` hacks

Replace with native CSS Grid:

```scss
.dashboard__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.widget-card--wide {
  grid-column: 1 / 2;
  grid-row: 1 / 3;       // spans both rows on desktop
}
```

Add to the `@media (max-width: 900px)` block:
```scss
.dashboard__grid {
  grid-template-columns: 1fr;
}

.widget-card--wide {
  grid-column: auto;
  grid-row: auto;
}
```

This eliminates all 6 `!important` declarations and the `::ng-deep` usage.

### 1D. Update dashboard module

**File:** `src/app/dashboard/dashboard.module.ts`

Remove from `imports` array:
- `MatGridListModule` (line 6/29)
- `LayoutModule` (line 11/34)

These are no longer needed after removing `mat-grid-list` and `BreakpointObserver`.

---

## Step 2 — Widget card header with description

### 2A. Add description styles

**File:** `src/app/dashboard/dashboard.component.scss`

Add after `.widget-card__title` (line 220):

```scss
.widget-card__header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.widget-card__description {
  font-size: 0.8125rem;
  font-weight: 400;
  color: $gray-500;
  margin: 0;
  line-height: 1.4;
}
```

No other widget-card styles need changing — the existing `.widget-card`, `.widget-card__header`, `.widget-card__icon`, `.widget-card__title`, and `.widget-card__body` are already well-designed.

---

## Step 3 — Chart visual improvements

### 3A. Week Posts bar chart — brand colors and polish

**File:** `src/app/dashboard/components/week-posts/week-posts.component.ts`

Replace `config` (lines 15-17):
```typescript
config: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },   // single dataset, legend is noise
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: '#64748b', font: { size: 12 } },
      grid: { color: '#f1f5f9' },
    },
  },
};
```

Add brand colors to the dataset inside the `map()` callback (lines 27-30). Add these properties alongside the existing `data` and `label`:
```typescript
backgroundColor: '#ff6b35',
hoverBackgroundColor: '#e55a2b',
borderRadius: 6,
borderSkipped: false,
maxBarThickness: 40,
```

### 3B. Common Locals pie chart — responsive and brand palette

**File:** `src/app/dashboard/components/common-locals/common-locals.component.ts`

Replace `config` (lines 17-25):
```typescript
config: ChartConfiguration['options'] = {
  responsive: true,                    // was false — fix
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#64748b',
        font: { size: 12 },
      },
    },
  },
};
```

Add brand color palette to the dataset inside the `map()` callback (line 34). Add alongside existing `data`:
```typescript
backgroundColor: [
  '#ff6b35', '#004e89', '#1a8fe3', '#ff8c69',
  '#64748b', '#334155', '#0f172a', '#94a3b8',
],
hoverOffset: 6,
borderWidth: 2,
borderColor: '#ffffff',
```

**File:** `src/app/dashboard/components/common-locals/common-locals.component.scss`

Replace entire file content:
```scss
:host {
  display: block;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 300px;
}
```

### 3C. Visual consistency note

Both charts now share:
- `responsive: true` + `maintainAspectRatio: true`
- Same gray for tick/label color (`#64748b` = gray-500)
- Same font size (12px)
- Brand-first color palette starting with sunset-orange

---

## Step 4 — Empty states for all data components

### 4A. Week Posts empty state

**File:** `src/app/dashboard/components/week-posts/week-posts.component.html`

Replace entire template:
```html
<ng-container *ngIf="chartData$ | async as data; else emptyState">
  <canvas baseChart [data]="data" [options]="config" type="bar"></canvas>
</ng-container>
<ng-template #emptyState>
  <div class="empty-state">
    <mat-icon>bar_chart</mat-icon>
    <p>Nenhuma postagem esta semana</p>
  </div>
</ng-template>
```

### 4B. Common Locals empty state

**File:** `src/app/dashboard/components/common-locals/common-locals.component.html`

Replace entire template:
```html
<ng-container *ngIf="chartData$ | async as data; else emptyState">
  <div class="chart-wrapper">
    <canvas baseChart type="pie" [data]="data" [options]="config"></canvas>
  </div>
</ng-container>
<ng-template #emptyState>
  <div class="empty-state">
    <mat-icon>pie_chart</mat-icon>
    <p>Nenhum destino registrado</p>
  </div>
</ng-template>
```

### 4C. Last Posts empty state

**File:** `src/app/dashboard/components/last-posts/last-posts.component.html`

Replace entire template:
```html
<ng-container *ngIf="lastPosts$ | async as posts; else emptyState">
  <mat-list>
    <mat-list-item *ngFor="let diario of posts; trackBy: trackByDiarioId" class="post-item">
      <span matListItemIcon class="post-avatar">
        {{ diario.usuarioName?.charAt(0) ?? '?' }}
      </span>
      <span matListItemTitle class="post-title">{{ diario.titulo }}</span>
      <span matListItemLine class="post-meta">
        {{ diario.usuarioName }} · {{ diario.createdAt | date:'dd MMM yyyy' }}
      </span>
    </mat-list-item>
  </mat-list>
</ng-container>
<ng-template #emptyState>
  <div class="empty-state">
    <mat-icon>article</mat-icon>
    <p>Nenhum post encontrado</p>
  </div>
</ng-template>
```

Note: Also enriches the list items — avatar initial, structured meta line with `·` separator, descriptive date format.

If Material 15 MDC list doesn't support `matListItemIcon`/`matListItemTitle`/`matListItemLine`, fall back to `mat-line` divs wrapping the same content.

### 4D. Shared empty state style

**File:** `src/app/dashboard/dashboard.component.scss`

Add at the end (before responsive media queries):

```scss
// Empty states
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-gray-400, #94a3b8);
  text-align: center;

  .mat-icon {
    font-size: 40px;
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
    font-weight: 500;
  }
}
```

This works because child component templates render inside the dashboard's view, inheriting these styles.

---

## Step 5 — Last Posts list styling

**File:** `src/app/dashboard/components/last-posts/last-posts.component.scss`

Replace entire file (currently empty):

```scss
:host {
  display: block;
}

.post-item + .post-item {
  border-top: 1px solid var(--color-gray-100, #f1f5f9);
}

.post-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-sunset-orange, #ff6b35);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.post-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-gray-900, #0f172a);
}

.post-meta {
  font-size: 0.75rem;
  color: var(--color-gray-500, #64748b);
}
```

---

## File Change Summary

| # | File | Action | What changes |
|---|------|--------|-------------|
| 1 | `dashboard.component.html` | Edit lines 32-62 | Replace `mat-grid-list` with 3 static `<article>` cards in CSS Grid |
| 2 | `dashboard.component.ts` | Remove ~25 lines | Delete `cards`, `trackByCardId`, `BreakpointObserver`, related imports |
| 3 | `dashboard.component.scss` | Edit ~20 lines | Remove `::ng-deep`/`!important`, add CSS Grid + `.widget-card--wide` + `.empty-state` + `.widget-card__description` |
| 4 | `dashboard.module.ts` | Remove 2 imports | Drop `MatGridListModule`, `LayoutModule` |
| 5 | `week-posts.component.ts` | Edit config + dataset | Chart options + brand colors |
| 6 | `week-posts.component.html` | Add empty state | `*ngIf else` pattern |
| 7 | `common-locals.component.ts` | Edit config + dataset | `responsive: true` + brand palette |
| 8 | `common-locals.component.html` | Add empty state | `*ngIf else` pattern |
| 9 | `common-locals.component.scss` | Edit 5 lines | Add `max-height`, `:host` block |
| 10 | `last-posts.component.html` | Rewrite template | Avatar + structured meta + empty state |
| 11 | `last-posts.component.scss` | Write new styles | Avatar, title, meta, dividers |

---

## Constraints

- Do NOT change `DashboardService` or any service method
- Do NOT change `ng2-charts` / `chart.js` libraries
- Do NOT add new npm dependencies
- Chart hex colors use raw values (Chart.js doesn't support CSS custom properties)
- All SCSS values must reference existing `:root` custom properties
- Keep `OnPush` change detection on child components
