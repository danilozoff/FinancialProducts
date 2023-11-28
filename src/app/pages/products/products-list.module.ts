import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { ProductsListRoutingModule } from './products-list-routing.module';
import { FormsModule } from '@angular/forms';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    ProductsListComponent,
    EditProductComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ProductsListRoutingModule
  ]
})
export class ProductsListModule { }
