import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiariosRoutingModule } from './diarios-routing.module';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiarioDetailComponent } from './components/diario-detail/diario-detail.component';
import { DiarioFormComponent } from './components/diario-form/diario-form.component';
import { DiarioListComponent } from './components/diario-list/diario-list.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DiarioDetailComponent,
    DiarioFormComponent,
    DiarioListComponent,
  ],
  imports: [
    CommonModule,
    DiariosRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class DiariosModule { }
