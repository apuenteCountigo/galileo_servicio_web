import { ItemSelectedType } from '../enums/item-tye.enum';
import { LoggedUserRole } from '../enums/user-role.enum';
import { Perfil } from './perfil.model';

export interface ButtonInterface {
  label: string;
  icon: string;
}

export interface UnitSearchCriteria {
  perfil: number;
  idUsuario: number;
  denominacion?: string;
  responsable?: string;
  provinciaDescripcion?: string;
  provinciaId?: number;
  localidad?: string;
}

export interface LoginInterface {
  username: string;
  password: string;
  grant_type: string;
}

export interface ItemSelectedInterface {
  type: ItemSelectedType;
}

export interface LoggedUser {
  tip: string;
  nombre: string;
  apellidos: string;
  role: LoggedUserRole;
  permissions?: string[];
  id: number;
  perfil: Perfil;
  traccar: string;
}

export interface objParams {
  [key: string]: any;
}

export interface configDataMimerInterfece {
  AlarmState: string;
  DashboardsType: string;
  DataMinerID: string;
  Decimals: number;
  Discreets: [];
  DisplayKeyID: number;
  DisplayValue: string;
  ElementID: number;
  Filters: any;
  HasRange: boolean;
  ID: number;
  InfoSubText: string;
  IsLogarithmic: boolean;
  IsMonitored: boolean;
  IsNumerical: boolean;
  IsTable: boolean;
  IsTableColumn: boolean;
  IsTrending: boolean;
  LastChangeUTC: number;
  LastValueChange: boolean;
  LastValueChangeUTC: number;
  Options: boolean;
  ParameterName: string;
  Positions: [];
  PrimaryKeyID: number;
  RangeHigh: number;
  RangeHighDisplay: any;
  RangeLow: number;
  RangeLowDisplay: any;
  ReadType: string;
  TableIndex: any;
  TableParameterID: number;
  Type: string;
  Unit: string;
  Value: string;
  WriteType: string;
  __type: string;
}

export interface configDataMimerPanificador {
  ParameterID: number;
  DisplayIndexValue: string;
  Cells: celda[];
}
export interface celda {
  DisplayValue: string;
  ParameterID: number;
  Value: string;
}
