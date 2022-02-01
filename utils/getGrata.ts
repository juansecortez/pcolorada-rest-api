import { getconectionVDBDELTA } from "../config/database";

export const getGrata = async (idDirection: number, year: number) => {
  const pool = await getconectionVDBDELTA();
  //Ejecutar el procedimiento almacenado de SQL SERVER
  if (pool === false) {
    throw new Error("No hay conexión");
  }
  const respond = await pool
    .request()
    .query(`EXEC [dbo].[DATOS_GRATA] '${idDirection}','${year}'`);
  const { recordsets } = respond;
  if (Object.keys(recordsets[0]).length === 0) {
    pool.close();
    throw new Error(`La grata del ${year} no existe`);
  }
  pool.close();
  const data = JSON.stringify(recordsets[0]);
  return data;
};
