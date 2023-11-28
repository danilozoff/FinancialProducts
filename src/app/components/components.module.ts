import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEditProductComponent } from './create-edit-product/create-edit-product.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    CreateEditProductComponent,
    PaginationComponent,
    SearchComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CreateEditProductComponent,
    ModalComponent,
    PaginationComponent,
    SearchComponent
  ]
})
export class ComponentsModule { }
