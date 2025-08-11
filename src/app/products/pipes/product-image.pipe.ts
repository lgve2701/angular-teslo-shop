import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
const imgUrlBase = environment.imgUrlBase

@Pipe({
    name: 'productImage',
})

export class ProductImagePipe implements PipeTransform{

    transform(value: null | string | string[]): string {
        //console.log({value});

        if (value == null){
            return './assets/images/no-image.jpg';
        }

        //string con 'blob' por que son locales
        if (typeof value == 'string' && value.startsWith('blob')){
            return value;
        }

        // string = string
        if (typeof value == 'string'){
            const img = `${imgUrlBase}${value}`; 
            //console.log('Producto; valor concatenado: ', img)
            return img;
        }

        // array > 1 = primer elemento
        const image = value[0];
        if ( !image ){
            // placeholder image: ./assets/images/no-image.jpg
            return './assets/images/no-image.jpg';

        }

        return `${imgUrlBase}${image}`;

    }

}
