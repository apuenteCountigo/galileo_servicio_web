import { User } from 'src/app/core/models/users.model';
import { HateoasResource, Resource } from "@lagoshny/ngx-hateoas-client";
import { TipoEntidad, Empleo } from './momencaldores.model';

@HateoasResource('listar')
export class Permiso extends Resource {
  public id!: number;
  public tipoEntidad!: TipoEntidad;
  public idEntidad?: number;
  public usuarios?: User;
  public permisos?: string;
}