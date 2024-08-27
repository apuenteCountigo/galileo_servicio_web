import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { Estado } from './estado.model';
import { ModeloBaliza, TipoBaliza, TipoContrato } from './momencaldores.model';
import { Operacion } from './operacion.model';
import { Server } from './server.model';
import { Unit } from './unit.model';


@HateoasResource('balizas')
export class Baliza extends Resource {
  public id!: number;
  public clave?: string;
  public tipoBaliza?: TipoBaliza | null;
  public marca?: string;
  public modelo?: ModeloBaliza | null;
  public numSerie?: string;
  public tipoCoordenada?: string | null;
  public imei?: string;
  public telefono1?: string;
  public compania?: number;
  public tipoContrato?: TipoContrato | null;
  public pin1?: number;
  public pin2?: number;
  public puk?: number;
  public iccTarjeta?: string;
  public fechaAlta?: Date;
  public fechaAsignaUni?: Date;
  public fechaAsignaOp?: string;
  public estados!: Estado;
  public idDataminer?: string;
  public idElement?: string;
  public serverIp?: string;
  public puerto?: string;
  public unidades?: Unit;
  public operacion?: string;
  public notas?: string;
  public servidor?: Server;
  public objetivo?: string;
}

export class DataminerElements {
  public name!: string;
  public id!: number;
  public amountElementsMaximum!: number;
  public amountElementsActive!: number;
}
