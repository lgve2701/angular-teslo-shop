
// hay 2 formas de hacer interceptores:
// 1. snippet a-http-interceptor (forma vieja) "export class x implements HttpInterceptor"
// 2. funciones (forma nueva)

import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function loggingInterceptor(
    req: HttpRequest<unknown>, 
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'loggingInterceptor: returned a response with status', event.status);
    }
  }));
}

