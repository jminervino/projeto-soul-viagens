import { PerfilEditComponent } from './components/perfil-edit/perfil-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [PerfilEditComponent],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    MaterialModule
  ]
})
export class PerfilModule { }
