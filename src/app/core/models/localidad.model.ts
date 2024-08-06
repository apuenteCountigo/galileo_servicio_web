import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('localidades')
export class Localidad extends Resource {
  public id?: number;
  public descripcion?: string;
}
