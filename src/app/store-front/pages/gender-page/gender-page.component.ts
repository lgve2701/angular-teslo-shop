import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent { 
  route = inject(ActivatedRoute);
  gender = toSignal(this.route.params.pipe(map(({gender}) => gender)));

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);  

  //-- en Angular 20, request cambio a params y loader cambio a stream --//
  productsResource = rxResource({
    params: () => ({gender: this.gender(), page: this.paginationService.currentPage() - 1}),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        gender: params.gender,
        offset: params.page * 9,
      });
    },
  });

}
