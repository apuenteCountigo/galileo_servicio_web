import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';
import { Baliza } from './baliza.model';

// export interface AccionEntidad {
//   descripcion: string;
// }

// export interface TipoEntidad {
//   descripcion: string;
//   id: number;
// }

@HateoasResource('listar')
export class Position extends Resource {
  public fecha!: Date;
  public id!: number;
  public descripcion?: string;
  public alias!: string;
  public clave!: string;
  public estadoBateria!: number;
  public evento!: string;
  public fechaCaptacion!: Date;
  public idPosicion!: number;
  public lacBts!: string;
  public latitud!: number;
  public longitud!: number;
  public mmcBts!: number;
  public mncBts!: number;
  public notas!: string;
  public precision!: string;
  public rumbo!: number;
  public satelites!: number;
  public senalGps!: number;
  public senalGsm!: number;
  public timestampServidor!: Date;
  public toponimia!: number;
  public velocidad!: number;
  public balizas!: Baliza;
}
