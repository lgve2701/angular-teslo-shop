import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [ RouterLink ],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent { 

  pages = input(0);
  currentPage = input<number>(1);

  //para saber como activar la pagina en la que me encuentro, se puede hacer de 2 formas:
  //1. inicializando una señal con el input currentPage
  //activePage = signal(this.currentPage());
  //2. angular recomienda que una señal que se inicializa desde algo que puede cambiar desde un input, usar linkedSignal
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({length: this.pages()}, (_, i) => i + 1);
  });
  
}
