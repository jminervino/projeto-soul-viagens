import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { onlyAdminGuard } from '../shared/guards/only-admin.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [onlyAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
