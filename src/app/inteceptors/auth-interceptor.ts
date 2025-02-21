import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, switchMap, tap, throwError } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private routers: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    
    if (authToken) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
    }
    return next.handle(request);
  }


  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.authService.getToken();
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return request;
  }

}
