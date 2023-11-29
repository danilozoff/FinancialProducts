import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit{

  showModal: boolean = false;
  titleModal: string = '';
  contentModal: string = '';
  isDeleteModal: boolean = false;

  products: Product[] = [];
  quantities = [
    { id: 1, amount: 5 },
    { id: 2, amount: 10 },
    { id: 3, amount: 20 }
  ];

  quantitySelected = 1;
  msgNumbersResult = '';
 
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  searchFilter: string = '';
  filteredProducts: Product[] = [];

  idProductToDelete: string = '';

  constructor(
    private _productsService: ProductsService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts(isDeleted = false) {
    try {
      const products$ = this._productsService.getProducts();
      this.products = await lastValueFrom(products$);
      this.filteredProducts = this.products;
      this.updateView(isDeleted);
    } catch (error) {
      this.titleModal = `Error`
      this.contentModal = `Error al recuperar los productos`
      this.isDeleteModal = false;
      this.showModal = true;
    }
  }

  updateView(isDeleted = false) {

    if (isDeleted) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredProducts = this.products;

    if (this.searchFilter) {
      const search = this.searchFilter.toLowerCase();
      this.filteredProducts = this.products.filter((product: Product) => product.name.toLowerCase().includes(search));
    } else {
      this.updatePager();
    }

    this.filteredProducts = this.filteredProducts.slice(startIndex, endIndex);

    this.getMsgNumbersResult();
  }
  
  onSelectQuantity() {
    const quantity = this.getQuantityToShow();
    this.itemsPerPage = quantity;
    this.updatePager();
    this.updateView();
  }

  updatePager() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    if (this.totalPages < 1) {
      this.totalPages = 1;
    }

    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  onSearchChange(filter: string) {
    this.searchFilter = filter;  
    this.updatePager();
    this.updateView();
  }

  getMsgNumbersResult() {
    this.msgNumbersResult = `${ this.filteredProducts.length } Resultados`;
  }

  getQuantityToShow() : number {
    const quantity = this.quantities.find((quantity) => quantity.id === Number(this.quantitySelected));
    return quantity?.amount || 5;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateView();
  }

  createProduct() {
    this.router.navigate(['create-product']);
  }

  editProduct(product: Product) {
    this.router.navigate([`/products/${ product.id }`], { state: product});
  }

  deleteProduct(product: Product) {
    this.idProductToDelete = product.id;
    this.contentModal = `¿Estas seguro de eliminar el producto ${ product.name }?`
    this.isDeleteModal = true;
    this.showModal = true;
  }
  
  closeModal() {
    this.idProductToDelete = '';
    this.showModal = false;
    this.isDeleteModal = false;
  }

  async confirmModal(event: any) {
    this.showModal = false;
    if (event === 'delete') {
      try {
        const product$ = this._productsService.deleteProduct(this.idProductToDelete);
        await lastValueFrom(product$);
        this.idProductToDelete = '';

        await this.getProducts(true);
      } catch (error) {
        this.titleModal = 'Error'
        this.contentModal = 'Error al eliminar producto'
        this.isDeleteModal = false;
        this.showModal = true;
      }
    }
  }

}
