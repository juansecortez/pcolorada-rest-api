import { getconectionGratas } from "../config/database";

export const getCurrentPeriod = async () => {
  const pool1 = await getconectionGratas();
  if (pool1 === false) {
    throw new Error("No hay conexión");
  }
  const result = await pool1.query(`USE GRATA
  EXEC [dbo].[obtenerPeriodoVigente]`);
  pool1.close();
  const { recordsets } = result;
  return recordsets[0];
};
