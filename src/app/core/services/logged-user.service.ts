import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom } from 'rxjs';
import { UserUnitSearchQuery } from '../constants/user-unit.query';
import { Estados } from '../enums/estados.enum';
import { LoggedUserRole } from '../enums/user-role.enum';
import { Perfil } from '../models/perfil.model';
import { LoggedUser } from './../models/interfaces';
import { UnitUserRelationService } from './unit-user-relation.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  jwtService = new JwtHelperService();
  query: UserUnitSearchQuery = new UserUnitSearchQuery();

  constructor(private _unitUserRelationService: UnitUserRelationService) {}

  isUserLoged(): boolean {
    if (localStorage.getItem('auth_token')) {
      return true;
    } else {
      return false;
    }
  }

  getTokenDecoded(): any {
    let token: any;
    if (this.isUserLoged()) {
      token = localStorage.getItem('auth_token');
      return this.jwtService.decodeToken(token);
    }
  }

  getLoggedUser(): LoggedUser {
    let token: any;
    if (this.isUserLoged()) {
      token = localStorage.getItem('auth_token');
      const tokenDecoded = this.jwtService.decodeToken(token);
      const loggedUser: LoggedUser = {
        tip: tokenDecoded.tip,
        nombre: tokenDecoded.nombre,
        apellidos: tokenDecoded.apellido,
        id: tokenDecoded.Id,
        perfil: tokenDecoded.Perfil,
        // role: LoggedUserRole.SUPER_ADMIN,
        role: tokenDecoded.authorities[0], // debe venir en la primera posicion el perfil o rol del user
        permissions: [],
        traccar: tokenDecoded.traccar,
      };
      return loggedUser;
    } else {
      return {
        tip: '',
        nombre: '',
        apellidos: '',
        id: 0,
        perfil: new Perfil(),
        role: LoggedUserRole.GUEST_USER,
        permissions: [],
        traccar: '',
      };
    }
  }

  async getUnit() {
    const loggedUser = this.getLoggedUser();
    const filter = {
      idUsuario: loggedUser.id,
      idEstado: Estados.PERMANENTE,
      fechaInicio: '',
      fechaFin: '',
    };

    return await firstValueFrom(
      this._unitUserRelationService.searchBy(
        filter,
        this.query.FILTRAR_UNIDADES
      )
    );
  }

  getTokenExpirationDate() {
    return this.jwtService.getTokenExpirationDate(this.getTokenDecoded().exp);
  }

  isAuthenticated(): boolean {
    let token: any;
    token = localStorage.getItem('auth_token');
    return !this.jwtService.isTokenExpired(token);
  }
}
