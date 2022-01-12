import { Request } from "express";

export interface IDecodeToken {
  USUARIOID: string;
  NOMBRE: string;
  NOEMPLEADO: string;
  direcciones: [];
  role: string;
  iat: number;
  exp: number;
}
export interface IGrata {
  presupuestoFinanzas: number;
  presupuestoMinas: number;
  presupuestoPelet: number;
  presupuestoRH: number;
  presupuestoGeneral: number;
  presupuestoBeneficio: number;
  presupuestoTec: number;
  presupuestoDirectores: number;
  anio: number;
  fechaFin: string;
  fechaInicio: string;
}
export interface IUserData {
  USUARIOID: string;
  NOMBRE: string;
  NOEMPLEADO: string;
  direcciones: [];
  role: string;
}
export interface IReqAuth extends Request {
  user?: IUserData;
}
