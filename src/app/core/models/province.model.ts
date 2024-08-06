import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('listar')
export class UnitProvince extends Resource {
  public id!: number;
  public descripcion!: string;
}
