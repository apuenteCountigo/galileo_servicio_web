// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';  // Servicio de autenticación (debe implementarse)
// import { JwtHelperService } from '@auth0/angular-jwt';

// @Injectable({
//   providedIn: 'root'
// })

// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router, private jwtHelper: JwtHelperService) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean | UrlTree {
//     const token = this.authService.getToken();  // Obtiene el token desde el servicio de autenticación

//     if (token) {
//       if (this.jwtHelper.isTokenExpired(token)) {  // Verifica si el token ha expirado
//         this.router.navigate(['login']);
//         return false;
//       }

//       const expectedRole = route.data['expectedRole']; // Obtiene el rol esperado desde los datos de la ruta
//       const tokenPayload = this.jwtHelper.decodeToken(token); // Decodifica el token

//       if (tokenPayload.role !== expectedRole) {  // Verifica si el rol del token coincide con el esperado
//         this.router.navigate(['access-denied']);
//         return false;
//       }

//       return true;  // Permite el acceso a la ruta
//     }

//     this.router.navigate(['login']);  // Redirige al login si no hay token
//     return false;
//   }
// }
