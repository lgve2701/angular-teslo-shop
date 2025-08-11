import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel.component/product-carousel.component";
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ReactiveFormsModule, ProductCarouselComponent, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit { 
  product = input.required<Product>();
  productService = inject(ProductsService);
  router = inject(Router);
  
  fb = inject(FormBuilder);

  alertMsg = signal('');

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  imagesToCarousel = computed(()=> {
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages;
  });
  
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],

    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],

    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    tags: [''],

    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|woman|kid|unisex/)]],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>){
    //this.productForm.reset(this.product() as any); <-- otra forma de hacerlo
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',')});
  }

  onSizeClicked(size: string)
  {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({sizes: currentSizes});
  }

  //async segun el curso para realizar como si fuera promesa del observable
  async onSubmit(){
    //console.log(this.productForm.value);
    let msg = '';
    
    this.productForm.markAllAsTouched();
    const isValid = this.productForm.valid;

    if(!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    };

    if (this.product().id == 'new'){
      //el firstValueFrom ya realiza un subscribe, el producto que devuelve sirve para navegar
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );
      msg = `Producto [${product.id}] creado con exito!`;
      this.router.navigate(['/admin/product', product.id]);
    } else {
      //el firstValueFrom ya realiza un subscribe; aqui no es necesario utilizar el "const product para obtener id u otros datos"
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
      msg = `Producto -${this.product().title}- actualizado con exito!`;
    }

    this.alertMsg.set(msg);
    setTimeout(() => {
      this.alertMsg.set('');
    }, 3000)

  }

  //-- esta version realiza el submit, al finalizar muestra ensaje de success, y luego crea un timeOut de 2 segundos --//
  onSubmit_v1(){
    //console.log(this.productForm.value);
    
    this.productForm.markAllAsTouched();
    const isValid = this.productForm.valid;

    if(!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    };

    if (this.product().id == 'new'){
      this.productService.createProduct(productLike, this.imageFileList).subscribe(product => {
        //console.log(`Producto ${product.id} creado con exito!`);
        this.alertMsg.set(`Producto [${product.id}] creado con exito!`);
        this.resetAlert();
        this.router.navigate(['/admin/product', product.id]);
      });
    } else {
      this.productService.updateProduct(this.product().id, productLike, this.imageFileList).subscribe(
        product => {
          //console.log(`Producto ${product.title} actualizado con exito!`);
          this.alertMsg.set(`Producto -${product.title}- actualizado con exito!`);
          this.resetAlert();
        }
      );
    }
    
  }

  resetAlert(){
      return new Promise( resolve => {
          setTimeout(() => {
              resolve(true);
              this.alertMsg.set('');
          }, 3000);
      });
  }

  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files;
    
    this.imageFileList = fileList ?? undefined;
    //console.log({fileList});

    const imageUrls = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));
    //console.log({imageUrls});

    this.tempImages.set(imageUrls);

    //para hacer un string.replace dentro de todos los items
    //imageUrls = imageUrls.map(image => image.replace(/blob:/, ""));
    //this.product().images.push(...imageUrls);
  }

}
