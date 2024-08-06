import {
  HateoasProjection,
  HateoasResource,
  Resource,
} from '@lagoshny/ngx-hateoas-client';
import { Estado } from './estado.model';
import { Rol, Empleo } from './momencaldores.model';
import { Unit, UnitUserRelation } from './unit.model';

@HateoasResource('usuarios')
export class User extends Resource {
  public id!: number;
  public tip!: string;
  public nombre!: string;
  public apellidos!: string;
  public contacto!: string;
  public email!: string;
  public password?: string;
  public certificado!: string;
  public estados?: Estado;
  public observaciones?: string;
  public traccar?: string;
  public perfil!: Rol;
  public empleos!: Empleo;
  // public unidades?: Unit[];
  public unidadesusuarios?: UnitUserRelation[];
  public fechaCreacion?: Date;
  public unidad?: Unit;
}

@HateoasProjection(User, 'userProjection')
export class UserProjection extends Resource {
  public id!: number;
  public tip!: string;
  public nombre!: string;
  public apellidos!: string;
}
