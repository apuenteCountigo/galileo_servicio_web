import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('tipoEntidad')
export class TipoEntidad extends Resource {
  public id!: number;
  public descripcion!: string;
}