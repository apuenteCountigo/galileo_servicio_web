import {
  EmbeddedResource,
  HateoasEmbeddedResource,
  HateoasResource,
  Resource,
} from '@lagoshny/ngx-hateoas-client';

@HateoasResource('geocercas')
export class Geocerca extends Resource {
  public id!: number;
  public idDataminer!: number;
  public idElement!: number;
  public asignadas!: Array<Asignadas>;
  public noAsignadas!: Array<NoAsignadas>;
}

@HateoasResource('asignadas')
export class Asignadas extends Resource {
  public id!: number;
  public index!: number;
  public name!: string;
  public activa!: boolean;
  public bottomLeftLatitude!: string;
  public bottomLeftLongitude!: string;
  public topRightLatitude!: string;
  public topRightLongitude!: string;
}

@HateoasResource('noAsignadas')
export class NoAsignadas extends Resource {
  public id!: number;
  public index!: number;
  public name!: string;
  public description!: string;
  public area!: string;
}

export class EstadoPeticionRequestDto {
  public id!: number;
  public value!: number;
  public displayValue!: string;
  public lastValueChange!: Date;
  public lastValueChangeUTC!: Date;
}
