import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { TipoEntidad } from './momencaldores.model';

@HateoasResource('estados')
export class Estado extends Resource {
  public id!: number;
  public descripcion?: string;
  public tipoEntidad?: TipoEntidad;
}
