import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditProductComponent } from './create-edit-product.component';
import { ProductsService } from 'src/app/services/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentsModule } from '../components.module';
import { of } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { validateBlanks } from 'src/app/validators/validators';
import { getYYYYMMDD } from 'src/app/utils/dates';

describe('CreateEditProductComponent', () => {
  let component: CreateEditProductComponent;
  let fixture: ComponentFixture<CreateEditProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductsService', ['validateIdExistent', 'editProduct', 'createProduct']);

    TestBed.configureTestingModule({
      declarations: [CreateEditProductComponent],
      imports: [
        ComponentsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProductsService, useValue: spy }
      ],
    });
    fixture = TestBed.createComponent(CreateEditProductComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values when there is no product', () => {
    component.initForm();

    expect(component.productForm.get('id')?.disabled).toBeFalsy();
    expect(component.productForm.value).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: component.minDateRelease
    });
  });

  it('should initialize the form with product data when there is a product', () => {
    component.product = {
      id: '1',
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    component.initForm();

    expect(component.productForm.get('id')?.disabled).toBeTruthy();
    expect(component.productForm.value).toEqual({
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: getYYYYMMDD(new Date()),
    });
  });

  it('should return null if ID does not exist', async () => {
    productServiceSpy.validateIdExistent.and.returnValue(of(false));

    component.product = {
      id: '',
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    component.initForm();
    const controlId = component.productForm.get('id')!;
    const result = await component.validateIdExistent(controlId);

    expect(result).toBeNull();
  });

  it('should return error if ID exists', async () => {
    productServiceSpy.validateIdExistent.and.returnValue(of(true));

    component.product = {
      id: '100',
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    component.initForm();
    const controlId = component.productForm.get('id')!;

    const result = await component.validateIdExistent(controlId);

    expect(result).toEqual({ idExist: true });
  });

  it('should return that it has a field with blank space', async () => {
    component.product = {
      id: '  ',
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    component.initForm();
    const control = component.productForm.get('id')!;

    const result = await validateBlanks(control);

    expect(result).toEqual({ hasBlancks: true });
  });

  it('should call editProduct and display success modal for edited product', async () => {
    component.product = {
      id: '100',
      name: 'Test Product',
      description: 'Product description',
      logo: 'product-logo.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    const updatedProduct = { 
      id: '100', 
      name: 'Updated Product', 
      description: 'Updated Description', 
      logo: 'updated-logo.png', 
      date_release: new Date(), 
      date_revision: new Date() 
    };

    const controls = component.productForm.controls;
    for (const control in controls) {
        controls[control].clearAsyncValidators();
        controls[control].updateValueAndValidity({ onlySelf: true });
    }
    component.productForm.updateValueAndValidity();

    component.productForm.setValue(updatedProduct);

    productServiceSpy.editProduct.and.returnValue(of(updatedProduct));

    await component.onSubmit();

    expect(productServiceSpy.editProduct).toHaveBeenCalledWith(updatedProduct);
    expect(component.contentModal).toContain('Se editó el producto Updated Product');
    expect(component.showModal).toBeTruthy();
  });

  it('should call createProduct and display success modal for new product', async () => {
    const newProduct: Product = {
      id: 'newId',
      name: 'New Product',
      description: 'New Description',
      logo: 'new-logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    };

    const controls = component.productForm.controls;
    for (const control in controls) {
        controls[control].clearAsyncValidators();
        controls[control].updateValueAndValidity({ onlySelf: true });
    }
    component.productForm.updateValueAndValidity();
    
    component.productForm.setValue(newProduct);

    productServiceSpy.createProduct.and.returnValue(of(newProduct));

    await component.onSubmit();

    expect(productServiceSpy.createProduct).toHaveBeenCalledWith(newProduct);
    expect(component.contentModal).toContain('Se creó el producto New Product');
    expect(component.showModal).toBeTruthy();
  });

  it('should update date_revision when updateDateRevision method is called with a valid dateRelease', () => {
    const dateRelease = '2023-11-26';
    const expectedDateRevision = '2024-11-26';

    component.updateDateRevision({ target: { value: dateRelease } });

    const dateRevisionControl = component.productForm.get('date_revision');
    expect(dateRevisionControl?.value).toEqual(expectedDateRevision);
  });

  it('should reset the form when resetFormProduct is called after creating a product', () => {
    const initialFormValue = {
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'product-logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    };

    component.productForm.setValue(initialFormValue);

    component.resetFormProduct();

    const resetFormValue = {
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
    };

    expect(component.productForm.value).toEqual(resetFormValue);
  });

  it('should set showModal and isDeleteModal to false when closeModal is called', () => {
    component.showModal = true;
    component.isDeleteModal = true;

    component.closeModal();

    expect(component.showModal).toBeFalse();
    expect(component.isDeleteModal).toBeFalse();
  });

  it('should mark all form controls as touched and set productMessage if form is invalid', () => {
    const newProduct: Product = {
      id: '',
      name: 'New Product',
      description: 'New Description',
      logo: 'new-logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    };

    const controls = component.productForm.controls;
    for (const control in controls) {
        controls[control].clearAsyncValidators();
        controls[control].updateValueAndValidity({ onlySelf: true });
    }
    component.productForm.updateValueAndValidity();
    
    component.productForm.setValue(newProduct);

    controls['id'].setErrors({ required: true });

    component.onSubmit();

    Object.values(controls).forEach(control => {
      expect(control.touched).toBeTrue();
    });

    expect(component.productMessage).toBeDefined();
  });

});
