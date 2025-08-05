import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
//import { ProductPageComponent } from '../product-page/product-page.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ ProductCardComponent ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 
  
  productsService = inject(ProductsService);

  //-- en Angular 20, request cambio a params y loader cambio a stream --//
  productsResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: 9
      });
    },
  });


  /*
  
  //-- tomado de CURSO ANGULAR: Seccion 18, Unidad 246, Min: 10 --//
  productsResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.productsService.getProducts();
    },
  });

  //-- chatGPT sugerencia 1 --//
  productsResource = rxResource({
    loader: () => this.productsService.getProducts(0)
  });

  //-- chatGPT sugerencia 2 --//
  productId = signal(1);
  productsResource = rxResource({
    key: this.productId,
    loader: (id) => this.productsService.getProducts(id)
  });

  */


}
