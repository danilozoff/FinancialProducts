import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products-list.module').then(m => m.ProductsListModule),
  },
  {
    path: 'create-product',
    loadChildren: () => import('./pages/create-product/create-product.module').then(m => m.CreateProductModule),
  },
  { path: '**',  redirectTo: 'products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
