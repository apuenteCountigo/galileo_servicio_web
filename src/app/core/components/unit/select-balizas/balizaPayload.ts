import { Estado } from "src/app/core/models/estado.model";
import { ModeloBaliza, TipoBaliza, TipoContrato } from "src/app/core/models/momencaldores.model";
import { UnitProvince } from "src/app/core/models/province.model";
import { Server } from "src/app/core/models/server.model";
import { Unit } from "src/app/core/models/unit.model";
import { User } from "src/app/core/models/users.model";

export class BalizaPayload {
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
    public unidades?: {};
    public operacion?: string;
    public notas?: string;
    public servidor?: Server;
    public objetivo?: string;
  }