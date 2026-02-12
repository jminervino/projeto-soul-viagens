import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { WeekPostsComponent } from './components/week-posts/week-posts.component';
import { CommonLocalsComponent } from './components/common-locals/common-locals.component';
import { LastPostsComponent } from './components/last-posts/last-posts.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    WeekPostsComponent,
    CommonLocalsComponent,
    LastPostsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    MaterialModule,
    SharedModule,
    NgChartsModule
  ],
})
export class DashboardModule {}
