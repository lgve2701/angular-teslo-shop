import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({ eventCoalescing: true}),
    provideRouter(routes),

    provideHttpClient(withFetch()), //seccion 18, unidad 246, min 6:20 aplicacion de este provider 
    
  ]
};
