import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "@auth/interfaces/user.interface";
import { Gender, Product, ProductsResponse } from "@products/interfaces/product.interface";
import { forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment.development";

const baseUrl = environment.baseUrl;

interface Options{
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: "new",
    title: "",
    price: 0,
    description: "",
    slug: "",
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService{

    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<String, Product>();

    getProducts(options: Options): Observable<ProductsResponse>{
        const {limit = 9, offset = 0, gender = ''} = options;

        const key = `${limit}-${offset}-${gender}`;

        if (this.productsCache.has(key)){
            return of(this.productsCache.get(key)!);
        }

        //console.log(`New key: ${key}`);
        return this.http.get<ProductsResponse>(
            `${baseUrl}/products`, {
                params: {
                    limit,
                    offset,
                    gender,
                }            
        })
        .pipe(
            //tap((resp) => console.log(resp)),
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

    getProductById(id: string): Observable<Product> {
        if(id == 'new'){
            return of(emptyProduct);
        }

        if(this.productCache.has(id)){
            return of (this.productCache.get(id)!);
        }
        console.log(`productId: ${id}`);
        
        return this.http.get<Product>(
            `${baseUrl}/products/${
                id
        }`)
        .pipe(
            tap((resp) => this.productCache.set(id, resp))
        );
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
        //v1: aqui inserta pero sin imagenes
        // return this.http.post<Product>(`${baseUrl}/products`, productLike)
        // .pipe(
        //         tap(
        //             (product) => this.updateProductCache(product)
        //         )
        //     );

        //v2: rxjs tiene una funcionalidad para ir ejecutando observables en secuencia
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(imageNames => ({
                ...productLike,
                images: [...currentImages, ...imageNames]
            })),
            switchMap((newProduct) =>
                this.http.post<Product>(`${baseUrl}/products`, newProduct)
            ),
            tap((product) => this.updateProductCache(product))
        );
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
        //console.log(productLike);
        //se actualiza el producto en la base con 'patch' y el 'tap' funciona como efecto secundario al retornar el patch

        //v1: aqui actualiza pero sin imagenes
        // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
        //     .pipe(
        //         tap(
        //             (product) => this.updateProductCache(product)
        //         )
        //     );

        //v2: rxjs tiene una funcionalidad para ir ejecutando observables en secuencia
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(imageNames => ({
                ...productLike,
                images: [...currentImages, ...imageNames]
            })),
            switchMap((updateProduct) => 
                this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProduct)
            ),
            tap((product) => this.updateProductCache(product))
        );
    }
    
    updateProductCache(product: Product){
        const id = product.id;
        //para el cache que solo tiene uno es facil
        this.productCache.set(id, product);

        //TODO: buscar forma de validar que el producto se encuentre en el cache de todos, si NO existe, insertarlo de una antes de recorrer foreach.
        //if (this.productsCache){}

        //se recorre los productos en el array del cache, pero es un response, por eso se usa el map
        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products.map((currentProduct) => {
                return currentProduct.id == id ? product : currentProduct;
            });
        });

        console.log('Cache actualizado!');
    }

    /*
        *IMPORTANT QA:
        --------------
        1. se creo un nuevo producto e inserto con exito
        2. al ir al listado, el producto SI aparece
        --
        1. se creo un nuevo producto e inserto con exito
        2. estando en la misma pantalla, se edito cualquier campo y se envio a actualizar y fue exitosa
        3. al ir al listado, el producto NO aparece 
            -> esto por que el producto no existe en el foreach de productsCache
    */

    uploadImages(images?: FileList): Observable<string[]>{
        if(!images) return of([]);

        const uploadObservables = Array.from(images).map((imageFile) =>
            this.uploadImage(imageFile)
        );

        return forkJoin(uploadObservables).pipe(
            tap((imageNames) => console.log({imageNames}))
        )

        return of([]);
    }

    uploadImage(imageFile: File): Observable<string>{
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http.post<{fileName:string}>(`${baseUrl}/files/product`, formData)
            .pipe(
                map(resp => resp.fileName)
            )
    }

}

