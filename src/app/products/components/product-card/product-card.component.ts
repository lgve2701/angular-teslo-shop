import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'product-card',
  imports: [ RouterLink, SlicePipe, ProductImagePipe ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent { 
  product = input.required<Product>();

  imgUrl = computed(() => {
    return environment.imgUrlBase + this.product().images[0];
  })

}

//export default ProductCardComponent;





  /*
  //-- intento propio siguiendo gifs-app --//
  productsService = inject(ProductsService);
  products = signal<ProductsResponse[]>([]);
  constructor(){
    this.productsService.getProducts({limit: 5, gender: 'kid'}).subscribe
    (
      resp => {
        this.products.set(resp);
      }
    );
  }
  */

  /*
  //-- ejemplo desde gifs-app --//
  gifs = signal<Gif[]>([]);
  this.gifService.searchGifs(texto).subscribe(
    resp =>{
      this.gifs.set(resp)
    }
  );
  */


    