import { HateoasResource, Resource } from "@lagoshny/ngx-hateoas-client";
import { Baliza } from "./baliza.model";
import { Juzgado } from "./juzgado.model";
import { Localidad } from "./localidad.model";
import { Operacion } from "./operacion.model";
import { User } from "./users.model";

@HateoasResource('listar')
export class Objetivo extends Resource {
  public id!: number;
  public descripcion!: string;
  public urgencia!: string;
  public telContactos!: string;
  public diligencias!: string;
  public equipo!: string;
  public fechaInicio!: Date;
  public finalAuto!: Date;
  public finalBateria!: Date;
  public emailIncidenciaJud!: String;
  public emailIncidencias!: String;
  public telefonos!: String;
  public docSolicitud!: string;
  public observaciones!: String;
  public juzgados!: Juzgado;
  public balizas!: Baliza;
  public localidad!: Localidad;
  public operaciones!: Operacion;
  public usuarios!: User;
}
