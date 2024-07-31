import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ'; // Replace with your actual token
    console.log('Interceptor: Request is intercepted');
    // Clone the request to add the new header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Interceptor: Authenticated request', authReq);
    // Pass the cloned request instead of the original request to the next handle
    return next.handle(authReq);
  }
}
