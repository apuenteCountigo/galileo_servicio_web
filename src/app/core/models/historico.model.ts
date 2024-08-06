import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { Baliza } from './baliza.model';
import { Operacion } from './operacion.model';

@HateoasResource('listar')
export class Historico extends Resource {
  public id!: number;
  public fecha!: Date;
  public baliza?: Baliza;
  public operacion?: Operacion;
  public accion?: { descripcion: string };
}
