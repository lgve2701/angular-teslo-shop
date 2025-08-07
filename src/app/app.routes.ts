import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            NotAuthenticatedGuard,
            
            /*() => {
                // tambien se puede crear una funcion que funcione como guarda
                // y aqui se pueden injectar servicios
                console.log('The world is yours! - app.routes.ts_canMatch_GuardFunction');
                return false; //al regresar FALSE, ya no redirecciona a 'auth' y lo envia al "not-found-page"
            } */
        ]        

    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes'),
    },
];
