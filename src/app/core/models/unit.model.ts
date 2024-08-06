import {
  HateoasProjection,
  HateoasResource,
  Resource,
} from '@lagoshny/ngx-hateoas-client';
import { Estado } from './estado.model';
import { Localidad } from './localidad.model';
import { UnitProvince } from './province.model';
import { User } from './users.model';

@HateoasResource('unidades')
export class Unit extends Resource {
  public id!: number;
  public denominacion!: string;
  public groupWise!: string;
  public email?: string;
  public direccion!: string;
  public notas?: string;
  public codigoPostal!: string;
  public oficialResponsable?: User;
  // public localidad!: Localidad;
  public localidad!: string;
  public provincia!: UnitProvince;
  public tmpUsuario?: User;
  public usuarios!: User[];
  public responsable?: string;
  public telefono?: string;
}

@HateoasResource('listar')
export class UnitUserRelation extends Resource {
  public id!: number;
  public unidad?: Unit;
  public usuario?: User;
  public expira?: Date;
  public estado!: Estado;
}

export class ResumenUnit {
  public cantidadBalizasStock!: number;
  public cantidadObjetivos!: number;
  public cantidadOperaciones!: number;
  public cantidadUsuarios!: number;
}
export class ResumenOper {
  public cantObjetivo!: number;
}

// @HateoasProjection('unidades')
// export class UnitProjection extends Resource {
//   public id!: number;

//   public oficialResponsable!: User;
//   public localidad!: Localidad;
//   public provincia!: UnitProvince;
//   public tmpUsuario?: User;
// }
