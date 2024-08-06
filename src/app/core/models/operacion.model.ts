import { Juzgado } from './juzgado.model';
import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { Estado } from './estado.model';
import { Server } from './server.model';
import { Unit } from './unit.model';

@HateoasResource('operaciones')
export class Operacion extends Resource {
  public id!: number;
  public descripcion!: string;
  public fechaInicio?: Date;
  public fechaFin?: Date;
  public fechaCreacion?: Date;
  public idDataminer?: string;
  public idElement?: string;
  public observaciones?: string;
  public diligencias?: string;
  public unidades?: Unit;
  public estados?: Estado;
  public servidor?: Server;
  public idGrupo?: number;
  public juzgado?: Juzgado;
}
