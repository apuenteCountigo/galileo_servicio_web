import { UnitProvince } from "src/app/core/models/province.model";
import { User } from "src/app/core/models/users.model";

export class UnidadPayload {
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