import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../shared/material.module';
import { HomeComponent } from './components/home/home.component';
import { HomeCarouselComponent } from './components/home-carousel/home-carousel.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeCarouselComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
