import { getconectionVDBGAMA } from "../config/database";

export const validExistSucesion = async (anio: number) => {
  const pool = await getconectionVDBGAMA();
  if (pool === false) {
    return;
  }
  const result = await pool
    .request()
    .query(`USE GRATA EXEC [dbo].[validarExisteSucesion] '${anio}'`);
  const { recordsets } = result;
  pool.close();
  return recordsets[0][0];
};
