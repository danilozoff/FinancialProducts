import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, fromEvent, lastValueFrom, merge } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/services/products.service';
import { GenericValidator } from 'src/app/validators/generic-validator';
import { validateBlanks } from 'src/app/validators/validators';
import { addOneYear, getYYYYMMDD } from '../../utils/dates';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.css']
})
export class CreateEditProductComponent implements OnInit, AfterViewInit {

  @Input() product: Product | undefined;

  showModal: boolean = false;
  titleModal: string = '';
  contentModal: string = '';
  isDeleteModal: boolean = false;

  minDateRelease: string = '';
  dateRevision: string = '';
  productForm: FormGroup = this.fb.group({});
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  // Form Validations
  productMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(
    private fb: FormBuilder, 
    private _productsService: ProductsService
  ) {    
    this.validationMessages = {
      id: {
        required: 'ID requerido',
        minlength: 'Debe tener al menos 3 caracteres',
        maxlength: 'Debe tener como máximo 10 caracteres',
        idExist: 'ID no válido',
        hasBlancks: 'No se permite solo espacios en blanco'
      },
      name: {
        required: 'Nombre requerido',
        minlength: 'Debe tener al menos 5 caracteres',
        maxlength: 'Debe tener como máximo 100 caracteres',
        hasBlancks: 'No se permite solo espacios en blanco'
      },
      description: {
        required: 'Descripción requerida',
        minlength: 'Debe tener al menos 10 caracteres',
        maxlength: 'Debe tener como máximo 200 caracteres',
        hasBlancks: 'No se permite solo espacios en blanco'
      },
      logo: {
        required: 'Descripción requerida',
        hasBlancks: 'No se permite solo espacios en blanco'
      },
      date_release: {
        required: 'Fecha liberación requerida',
        hasBlancks: 'No se permite solo espacios en blanco'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const now = new Date();
    this.minDateRelease = getYYYYMMDD(now)
    this.dateRevision = getYYYYMMDD(addOneYear(this.minDateRelease));

    let productDateRelease: string = '';
    let productDateRevision: string = '';

    if (this.product) {
      productDateRelease = getYYYYMMDD(new Date(this.product.date_release));
      productDateRevision = getYYYYMMDD(new Date(this.product.date_revision));
    }

    this.productForm = this.fb.group({
      id: [
        { 
          value: this.product ? this.product.id : '', 
          disabled: this.product ?? false
        },
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)], 
        [this.validateIdExistent.bind(this), validateBlanks.bind(this)]
      ],
      name: [
        this.product ? this.product.name : '', 
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
        [validateBlanks.bind(this)]
      ],
      description: [
        this.product ? this.product.description : '', 
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
        [validateBlanks.bind(this)]
      ],
      logo: [
        this.product ? this.product.logo : '', 
        Validators.required,
        [validateBlanks.bind(this)]
      ],
      date_release: [
        this.product ? productDateRelease : this.minDateRelease, 
        Validators.required,
        [validateBlanks.bind(this)]
      ],
      date_revision: [
        { 
          value: this.product ? productDateRevision : this.dateRevision,
          disabled: true 
        }
      ],
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));


    merge(this.productForm.valueChanges, ...controlBlurs).pipe(debounceTime(500)).subscribe((value) => {
      this.productMessage = this.genericValidator.processMessages(this.productForm);
    });
  }

  public async validateIdExistent(control: AbstractControl) {
    const id = control.value;
    let error = null;

    if (id) {
      const validateIdExist$ = this._productsService.validateIdExistent(id);
      const exist = await lastValueFrom(validateIdExist$);
      
      if (exist) {
        error = {
          idExist: exist
        }    
      }
    }

    return error;
  }

  updateDateRevision(event: any) {
    const dateRelease = event.target.value;
    if (dateRelease) {
      const dateRevision = getYYYYMMDD(addOneYear(dateRelease));
      this.productForm.get('date_revision')?.setValue(dateRevision);
    }
  }

  resetFormProduct() {
    this.productForm.reset();

    const id = this.product ? this.product.id : '';

    const newProduct = {
      id,
      name: '',
      description: '',
      logo: '',
      date_release: this.minDateRelease,
      date_revision: this.dateRevision
    }

    setTimeout(() => this.productForm.patchValue(newProduct), 0);      
  }

  async onSubmit() {

    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsTouched();
      });

      this.productMessage = this.genericValidator.processMessages(this.productForm);
    }
    else {
      const id = this.productForm.controls['id'].value;
      const name = this.productForm.controls['name'].value;
      const description = this.productForm.controls['description'].value;
      const logo = this.productForm.controls['logo'].value;
      const date_release = this.productForm.controls['date_release'].value;
      const date_revision = this.productForm.controls['date_revision'].value;

      const formProduct: Product = {
        id,
        name,
        description,
        logo,
        date_release,
        date_revision
      };

      if (this.product) {
        await lastValueFrom(this._productsService.editProduct(formProduct));
        this.contentModal = `Se editó el producto ${ formProduct.name }`
      } else {
        await lastValueFrom(this._productsService.createProduct(formProduct));
        this.contentModal = `Se creó el producto ${ formProduct.name }`
      }

      this.isDeleteModal = false;
      this.showModal = true;
  
      if (!this.product) {
        this.resetFormProduct(); 
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.isDeleteModal = false;
  }

  async confirmModal(event: any) {
    this.showModal = false;
  }
}
