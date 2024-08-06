import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _loggedUserService: LoggedUserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    if (!request.url.toString().includes('security/oauth/token'))
      if (token) {
        if (
          request.url.includes('search') ||
          request.url.includes('evidencias')
        ) {
          const idAuth = this._loggedUserService.getLoggedUser().id;
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + token,
              // 'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            setParams: { idAuth: idAuth.toString() },
          });
        } else {
          if (!request.url.includes('importador/importarExcel')) {
            request = request.clone({
              setHeaders: {
                Authorization: 'Bearer ' + token,
                // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            });
          }
        }
      } else {
      }
    return next.handle(request);
  }
}
