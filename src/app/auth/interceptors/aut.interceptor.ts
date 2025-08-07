
// hay 2 formas de hacer interceptores:
// 1. snippet a-http-interceptor (forma vieja) "export class x implements HttpInterceptor"
// 2. funciones (forma nueva)

import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const token = inject(AuthService).token();

  //-- aqui se puede filtrar para solo ciertas url intercepten el token --//
  console.log({token});
  
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append(`Authorization`, `Bearer ${token}`),
  });
  
  return next(newReq);

}

/*
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
*/

