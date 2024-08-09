import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const tokenPayload = this.jwtHelper.decodeToken(token);
        console.log("***tokenPayload***");
        console.log(tokenPayload);
      } catch (error) {
        console.log("***ERROR***");
        console.log(error);
        
      }
      return true;
    }
    this.router.navigate(['/'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
