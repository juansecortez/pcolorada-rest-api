import { Request, Response } from "express";
import { getconectionGratas, getconectionVDBDELTA } from "../config/database";
import { getGrata } from "./getGrata";

const newGrata = async (
  anio: number,
  fecha_Fin: string,
  fecha_Inicio: string,
  data1: string,
  data2: string,
  data3: string,
  data4: string,
  data5: string,
  data6: string,
  data7: string,
  data8: string,
  presupuestoRH: number,
  presupuestoFinanzas: number,
  presupuestoMinas: number,
  presupuestoBeneficio: number,
  presupuestoPelet: number,
  presupuestoGeneral: number,
  presupuestoTec: number,
  presupuestoDirectores: number
) => {
  const pool = await getconectionGratas();
  if (pool === false) {
    throw new Error("No hay conexión");
  }
  const respondG = await pool.request().query(`USE GRATA
        EXEC [dbo].[createNewGrata] '${data1}','${data2}','${data3}','${data4}',
        '${data5}','${data6}','${data7}','${data8}','${anio}',
        '${fecha_Inicio}','${fecha_Fin}','${presupuestoRH}','${presupuestoFinanzas}',
        '${presupuestoMinas}','${presupuestoBeneficio}','${presupuestoPelet}','${presupuestoGeneral}',
        '${presupuestoTec}','${presupuestoDirectores}'`);
  const { recordsets: respond2 } = respondG;
  console.log(respondG.recordset);
  if (Object.keys(respond2).length === 0) {
    pool.close();
    throw new Error("No se creo la grata");
  }
  pool.close();
};

export default newGrata;
