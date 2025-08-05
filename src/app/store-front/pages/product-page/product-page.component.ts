import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel.component/product-carousel.component';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-page',
  imports: [ ProductCarouselComponent ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent { 


  activateRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  productIDSlug = this.activateRoute.snapshot.params['idSlug'];
  //productIDSlugMap = this.activateRoute.snapshot.paramMap.get('idSlug') || '';

  productResource = rxResource({
    params:() => ({ idSlug: this.productIDSlug }),
    stream: ({params}) => {
      return this.productsService.getProductByIDSlug(params.idSlug);
    }
  })

  /*
  productsService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.productsService.getProducts({});
    },
  });
  */

}
