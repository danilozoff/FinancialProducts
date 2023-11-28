import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProductsListComponent } from './products-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsService } from 'src/app/services/products.service';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsService: ProductsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsListComponent],
      imports: [
        RouterTestingModule, 
        HttpClientTestingModule, 
        ComponentsModule,
        FormsModule
      ],
      providers: [ProductsService],
    });
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProducts on ngOnInit', async () => {
    const getProductsSpy = spyOn(component, 'getProducts').and.callThrough();
    component.ngOnInit();
    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should handle successful getProducts', async () => {
    const products: Product[] = [
      {
        id: '100',
        name: 'Producto 1',
        description: 'Descripcion de Producto 1',
        logo: 'logoProducto1',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '200',
        name: 'Producto 2',
        description: 'Descripcion de Producto 2',
        logo: 'logoProducto2',
        date_release: new Date(),
        date_revision: new Date()
      }
    ]

    spyOn(productsService, 'getProducts').and.returnValue(of(products));
    const updateViewSpy = spyOn(component, 'updateView');

    await component.getProducts();

    expect(component.products).toEqual(products);
    expect(component.filteredProducts).toEqual(products);
    expect(updateViewSpy).toHaveBeenCalled();
  });

  it('should handle error in getProducts', async () => {
    spyOn(productsService, 'getProducts').and.returnValue(throwError(() => new Error('Error')));
    const updateViewSpy = spyOn(component, 'updateView');

    await component.getProducts();

    expect(component.titleModal).toEqual('Error');
    expect(component.contentModal).toEqual('Error al recuperar los productos');
    expect(component.isDeleteModal).toEqual(false);
    expect(component.showModal).toEqual(true);
    expect(updateViewSpy).not.toHaveBeenCalled();
  });

  it('should handle onSelectQuantity', () => {
    const getQuantityToShowSpy = spyOn(component, 'getQuantityToShow').and.returnValue(10);
    const updatePagerSpy = spyOn(component, 'updatePager');
    const updateViewSpy = spyOn(component, 'updateView');

    component.onSelectQuantity();

    expect(component.itemsPerPage).toEqual(10);
    expect(getQuantityToShowSpy).toHaveBeenCalled();
    expect(updatePagerSpy).toHaveBeenCalled();
    expect(updateViewSpy).toHaveBeenCalled();
  });

  it('should handle onSearchChange', () => {
    const updatePagerSpy = spyOn(component, 'updatePager');
    const updateViewSpy = spyOn(component, 'updateView');

    component.onSearchChange('test');

    expect(updatePagerSpy).toHaveBeenCalled();
    expect(updateViewSpy).toHaveBeenCalled();
  });

  it('should handle onPageChange', () => {
    const updateViewSpy = spyOn(component, 'updateView');

    component.onPageChange(2);

    expect(component.currentPage).toEqual(2);
    expect(updateViewSpy).toHaveBeenCalled();
  });

  it('should handle createProduct', () => {
    const navigateSpy = spyOn(component.router, 'navigate');

    component.createProduct();

    expect(navigateSpy).toHaveBeenCalledWith(['create-product']);
  });

  it('should handle editProduct', () => {
    const product: Product = {
      id: '100',
      name: 'Producto 1',
      description: 'Descripcion de Producto 1',
      logo: 'logoProducto1',
      date_release: new Date(),
      date_revision: new Date()
    }
    
    const navigateSpy = spyOn(component.router, 'navigate');

    component.editProduct(product);

    expect(navigateSpy).toHaveBeenCalledWith(['/products/100'], { state: product });
  });

  it('should handle deleteProduct', () => {
    const product: Product = {
      id: '100',
      name: 'Producto 1',
      description: 'Descripcion de Producto 1',
      logo: 'logoProducto1',
      date_release: new Date(),
      date_revision: new Date()
    }

    component.deleteProduct(product);

    expect(component.showModal).toEqual(true);
    expect(component.isDeleteModal).toEqual(true);
    expect(component.idProductToDelete).toEqual(product.id);
    expect(component.contentModal).toEqual(`¿Estas seguro de eliminar el producto ${product.name}?`);
  });

  it('should handle closeModal', () => {
    component.closeModal();

    expect(component.idProductToDelete).toEqual('');
    expect(component.showModal).toEqual(false);
    expect(component.isDeleteModal).toEqual(false);
  });

  it('should handle confirmModal for delete event', fakeAsync(() => {
    
    const getProductsSpy = spyOn(component, 'getProducts').and.callThrough();
    const deleteProductSpy = spyOn(productsService, 'deleteProduct').and.returnValue(of(''));

    component.idProductToDelete = '1';
    component.showModal = true;

    component.confirmModal('delete');

    tick();

    expect(component.showModal).toEqual(false);
    expect(deleteProductSpy).toHaveBeenCalledWith('1');
    expect(getProductsSpy).toHaveBeenCalled();
  }));

  it('should return the correct quantity when quantitySelected is found', () => {
    component.quantities = [
      { id: 1, amount: 5 },
      { id: 2, amount: 10 },
      { id: 3, amount: 20 },
    ];
    component.quantitySelected = 2;

    const result = component.getQuantityToShow();

    expect(result).toEqual(10);
  });

  it('should return default quantity (5) when quantitySelected is not found', () => {
    component.quantities = [
      { id: 1, amount: 5 },
      { id: 2, amount: 10 },
      { id: 3, amount: 20 },
    ];
    component.quantitySelected = 99;

    const result = component.getQuantityToShow();
    expect(result).toEqual(5);
  });

  it('should update the view without searchFilter', () => {
    const getMsgNumbersResultSpy = spyOn(component, 'getMsgNumbersResult')
    component.currentPage = 1;
    component.itemsPerPage = 5;
    component.products = [
      {
        id: '100',
        name: 'Producto 1',
        description: 'Descripcion de Producto 1',
        logo: 'logoProducto1',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '200',
        name: 'Producto 2',
        description: 'Descripcion de Producto 2',
        logo: 'logoProducto2',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '300',
        name: 'Producto 3',
        description: 'Descripcion de Producto 3',
        logo: 'logoProducto3',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '400',
        name: 'Producto 4',
        description: 'Descripcion de Producto 4',
        logo: 'logoProducto4',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '500',
        name: 'Producto 5',
        description: 'Descripcion de Producto 5',
        logo: 'logoProducto5',
        date_release: new Date(),
        date_revision: new Date()
      }
    ];

    component.updateView();

    expect(component.filteredProducts).toEqual(component.products);
    expect(getMsgNumbersResultSpy).toHaveBeenCalled();
  });

  it('should update the view with searchFilter', () => {
    const getMsgNumbersResultSpy = spyOn(component, 'getMsgNumbersResult')
    component.currentPage = 1;
    component.itemsPerPage = 5;
    component.products = [
      {
        id: '100',
        name: 'Producto 1',
        description: 'Descripcion de Producto 1',
        logo: 'logoProducto1',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '200',
        name: 'Producto 2',
        description: 'Descripcion de Producto 2',
        logo: 'logoProducto2',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '300',
        name: 'Producto 3',
        description: 'Descripcion de Producto 3',
        logo: 'logoProducto3',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '400',
        name: 'Producto 4',
        description: 'Descripcion de Producto 4',
        logo: 'logoProducto4',
        date_release: new Date(),
        date_revision: new Date()
      },
      {
        id: '500',
        name: 'Producto 5',
        description: 'Descripcion de Producto 5',
        logo: 'logoProducto5',
        date_release: new Date(),
        date_revision: new Date()
      }
    ];
    component.searchFilter = 'Producto 2'; 

    component.updateView();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Producto 2');
    expect(getMsgNumbersResultSpy).toHaveBeenCalled();
  });

});
