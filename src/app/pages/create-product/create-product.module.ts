import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProductComponent } from './create-product.component';
import { CreateProductRoutingModule } from './create-product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    CreateProductComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    CreateProductRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreateProductModule { }
