import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

export class NomencladorBase extends Resource {
  public id!: number;
  public descripcion!: string;
}

@HateoasResource('empleos')
export class Empleo extends NomencladorBase {}

@HateoasResource('perfiles')
export class Rol extends Resource {
  public id!: number;
  public descripcion?: string;
}

@HateoasResource('provincias')
export class UnitProvince extends Resource {
  public id!: number;
  public descripcion!: string;
}

@HateoasResource('tipobalizas')
export class TipoBaliza extends Resource {
  public id?: number;
  public descripcion?: string;
}
@HateoasResource('modelosbalizas')
export class ModeloBaliza extends Resource {
  public id?: number;
  public descripcion?: string;
}

@HateoasResource('tipocontratos')
export class TipoContrato extends Resource {
  public id!: string;
  public descripcion?: string;
}

@HateoasResource('tipoEntidad')
export class TipoEntidad extends Resource {
  public id!: string;
  public descripcion?: string;
}
