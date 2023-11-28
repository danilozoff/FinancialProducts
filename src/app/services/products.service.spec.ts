import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../interfaces/product.interface';
import { environment } from '../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should get products', () => {
    const dummyProducts: Product[] = [
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
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(dummyProducts);
    });

    const req = httpTestingController.expectOne(`${environment.API_BASE_URL}/bp/products`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyProducts);
  });

  it('should validate product ID existence', () => {
    const productId = '123';

    service.validateIdExistent(productId).subscribe(response => {
      expect(response).toEqual({ idExist: true });
    });

    const req = httpTestingController.expectOne(`${environment.API_BASE_URL}/bp/products/verification?id=${productId}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ idExist: true });
  });

  it('should create a product', () => {
    const dummyProduct: Product = {
      id: '200',
      name: 'Producto 2',
      description: 'Descripcion de Producto 2',
      logo: 'logoProducto2',
      date_release: new Date(),
      date_revision: new Date()
    };

    service.createProduct(dummyProduct).subscribe(response => {
      expect(response).toEqual(dummyProduct);
    });

    const req = httpTestingController.expectOne(`${environment.API_BASE_URL}/bp/products`);
    expect(req.request.method).toEqual('POST');
    req.flush(dummyProduct);
  });

  it('should edit a product', () => {
    const dummyProduct: Product = {
      id: '200',
      name: 'Producto 2',
      description: 'Descripcion de Producto 2',
      logo: 'logoProducto2',
      date_release: new Date(),
      date_revision: new Date()
    };

    service.editProduct(dummyProduct).subscribe(response => {
      expect(response).toEqual(dummyProduct);
    });

    const req = httpTestingController.expectOne(`${environment.API_BASE_URL}/bp/products`);
    expect(req.request.method).toEqual('PUT');
    req.flush(dummyProduct);
  });

  it('should delete a product', () => {
    const productId = '123';

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toEqual('');
    });

    const req = httpTestingController.expectOne(
      `${environment.API_BASE_URL}/bp/products?id=${productId}`,
      'DELETE request to expected URL'
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush('');
  });

});
