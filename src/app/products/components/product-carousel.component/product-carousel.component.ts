import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

import Swiper from 'swiper';

import 'swiper/css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper{
      width: 100%;
      height: 500px;
    },
  
  `,
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges { 

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper|undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes['images'].currentValue);
    //el primer cambio es cuando inicia la pagina por primera vez, sus imagenes vienen del api, ya despues cambia al agregar en tiempo real
    if(changes['images'].firstChange){
      return;
    }

    //se valida que el objeto tenga instancia
    if(!this.swiper){
      return;
    }

    //v2: se destruye la instancia y se inicia de nuevo
    this.swiper.destroy(true, true);

    //el swiper al ser un paquete externo a Angular, es construido pero no logra organizar bien los puntitos de la paginacion
    //para solucionar los puntitos hay que:

    //obtener el div que tiene la paginacion
    const paginationEl: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    //remover el contenido, es decir los puntitos
    paginationEl.innerHTML = '';
    //poner un mini-temporizador para que le de un instante al swiper antes de reiniciar
    setTimeout(()=>{
      this.swiperInit();
    }, 100);

    //el swiper tiene opcion de agregar lo que iria creando los html para las imagenes, pero al destruir y reiniciar ya funciona.
    //this.swiper.addSlide;
  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit(){

    const element = this.swiperDiv().nativeElement;
    if (!element) return; //aqui se puede lanzar una excepcion

    //const swiper = new Swiper(element, { //<-- v1: cuando se implemento la primera vez en el curso, se inicia el carrusel segun docu
    //v2: para agregarle imagenes en tiempo real, se mantiene una instancia del objeto carrusel y asi poder destruirlo y reinicializarlo
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules:[
        Navigation, Pagination,
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

  }

}

