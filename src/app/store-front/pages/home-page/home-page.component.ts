import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
//import { ProductPageComponent } from '../product-page/product-page.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
//import { ActivatedRoute } from '@angular/router';
//import { map } from 'rxjs';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 
  
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  //-- en Angular 20, request cambio a params y loader cambio a stream --//
  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
      });
    },
  });

 
  /*

  //-- codigo ahora en un servicio para ser reutilizable en otros componentes --//
  activatedRoute = inject(ActivatedRoute);
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => (params.get('page') ? +params.get('page')! : 1)),
      map(page => (isNaN(page) ? 1 : page))
    ),{
        initialValue: 1
    }
  )

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
