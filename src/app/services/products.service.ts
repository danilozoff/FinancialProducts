import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment, httpHeader } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _http: HttpClient) { }
  
  getProducts(): Observable<Product[]> {
    return this._http.get(`${environment.API_BASE_URL}/bp/products`, { headers: { authorId: httpHeader.authorId } }).pipe(
      map((response: any) => {
        let products: Product[] = [];
        if (response) {
          products = response;
        }
        return products;
      })
    );
  }

  validateIdExistent(productId: string) {
    return this._http.get(`${environment.API_BASE_URL}/bp/products/verification`, { headers: { authorId: httpHeader.authorId }, params: { id: productId } }).pipe(
      (response: any) => response
    );
  }

  createProduct(product: Product) {
    return this._http.post(`${environment.API_BASE_URL}/bp/products`, product, { headers: { authorId: httpHeader.authorId } });
  }

  editProduct(product: Product) {
    return this._http.put(`${environment.API_BASE_URL}/bp/products`, product, { headers: { authorId: httpHeader.authorId } });
  }
  
  deleteProduct(productId: string) {
    const headers = new HttpHeaders().set('authorId', httpHeader.authorId);
    const params = new HttpParams().set('id', productId);
    return this._http.delete(`${environment.API_BASE_URL}/bp/products`, { headers, params, responseType: 'text' as 'json' });
  }
}
