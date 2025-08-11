import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent { 

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)
  productsPerPage = signal<number>(10);
  
  //-- en Angular 20, request cambio a params y loader cambio a stream --//
  productsResource = rxResource({
    params: () => ({ 
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: params.limit,
        offset: params.page * this.productsPerPage(),
      });
    },
  });

  //en el change del dropdown usando una funcion para setear su valor seleccionado
  onChangeProductsPerPage(limitValue: number){
    this.productsPerPage.set(limitValue);
    this.paginationService.resetCurrentPage();
  }


}
