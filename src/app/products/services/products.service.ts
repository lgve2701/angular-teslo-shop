import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product, ProductsResponse } from "@products/interfaces/product.interface";
import { Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment.development";

const baseUrl = environment.baseUrl;

interface Options{
    limit?: number;
    offset?: number;
    gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService{

    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<String, Product>();

    //-- CONTINUAR EN VIDEO 264; EJERCICIO DE GUARDAR EN CACHE 1 SOLO PRODUCTO CONSULTADO --//

    getProducts(options: Options): Observable<ProductsResponse>{
        const {limit = 9, offset = 0, gender = ''} = options;

        const key = `${limit}-${offset}-${gender}`;

        if (this.productsCache.has(key)){
            return of(this.productsCache.get(key)!);
        }

        console.log(`New key: ${key}`);
        return this.http.get<ProductsResponse>(
            `${baseUrl}/products`, {
                params: {
                    limit,
                    offset,
                    gender,
                }            
        })
        .pipe(
            tap((resp) => console.log(resp)),
            tap((resp) => this.productsCache.set(key, resp))
        );
    }

    getProductByIDSlug(idSlug: string): Observable<Product> {
        if(this.productCache.has(idSlug)){
            return of (this.productCache.get(idSlug)!);
        }
        console.log(`idSlug: ${idSlug}`);
        
        return this.http.get<Product>(
            `${baseUrl}/products/${
                idSlug
        }`)
        .pipe(
            tap((resp) => this.productCache.set(idSlug, resp))
        );
    }
    
}

