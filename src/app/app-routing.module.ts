import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Redirecionamentos para manter /login, /cadastro etc. (lazy auth em /auth)
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'cadastro', redirectTo: 'auth/cadastro', pathMatch: 'full' },
  { path: 'recuperar-senha', redirectTo: 'auth/recuperar-senha', pathMatch: 'full' },
  { path: 'confirmar-email', redirectTo: 'auth/confirmar-email', pathMatch: 'full' },
  { path: 'termos-de-privacidade', redirectTo: 'auth/termos-de-privacidade', pathMatch: 'full' },
  // Lazy-loaded feature modules
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'diarios',
    loadChildren: () => import('./diarios/diarios.module').then((m) => m.DiariosModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  // Qualquer rota desconhecida → landing page
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
