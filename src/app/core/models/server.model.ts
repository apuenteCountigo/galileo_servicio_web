import { HateoasResource, Resource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('conexiones')
export class Server extends Resource {
  public id!: number;
  public servicio!: string;
  public ipServicio?: string;
  public puerto?: string;
  public usuario?: string;
  public password?: string;
  public dmaID?: number;
  public viewIDs?: number;
}
