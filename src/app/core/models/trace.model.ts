import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { User } from './users.model';

export interface AccionEntidad {
  descripcion: string;
}

export interface TipoEntidad {
  descripcion: string;
  id: number;
}

@HateoasResource('listar')
export class Trace extends Resource {
  public accionEntidad!: AccionEntidad;
  public tipoEntidad!: TipoEntidad;
  public usuario!: User;
  public idEntidad!: number;
  public fecha!: Date;
  public id!: number;
  public descripcion?: string;
}
