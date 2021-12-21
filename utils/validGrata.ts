import { getconectionGratas } from "../config/database";

export const validExistGrata = async (anio: number) => {
  try {
    const pool = await getconectionGratas();
    if (pool === false) {
      return;
    }
    const result = await pool
      .request()
      .query(`USE GRATA EXEC [dbo].[validarExisteGrata] '${anio}'`);
    const { recordsets } = result;
    pool.close();
    return recordsets[0][0];
  } catch (error: any) {
    console.log(error);
    return;
  }
};
