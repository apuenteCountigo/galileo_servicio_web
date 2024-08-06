import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('perfiles')
export class Perfil extends Resource {
  public id?: number;
  public descripcion?: string;
}
