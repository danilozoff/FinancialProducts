import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  editProduct: Product | undefined;

  showModal: boolean = false;
  titleModal: string = '';
  contentModal: string = '';
  isDeleteModal: boolean = false;

  constructor(
    private router: Router
  ) { 
    this.init();
  }

  init() {
    try {
      const state = this.router.getCurrentNavigation()?.extras.state;
      
      if (!state) {
        this.router.navigate([`/products`]);
      }

      this.editProduct = state as Product;

    } catch (error) {
      this.titleModal = `Error`
      this.contentModal = `Error al recuperar los productos`
      this.isDeleteModal = false;
      this.showModal = true;
      this.goBack();
    };
  }

  goBack() {
    this.router.navigate([`/products`]);
  }

  closeModal() {
    this.showModal = false;
    this.isDeleteModal = false;
  }

  async confirmModal(event: any) {
    this.showModal = false;
  }

}
