// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const serviceToken = localStorage.getItem('serviceToken');
    
//     if (serviceToken) {
//       const cloned = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${serviceToken}`
//         }
//       });

//       return next.handle(cloned);
//     } else {
//       return next.handle(req);
//     }
//   }
// }
