import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('listar')
export class ModeloBaliza extends Resource {
  public id!: number;
  public descripcion!: string;
}
