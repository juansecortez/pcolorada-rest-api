import { getconectionGratas, getconectionVDBDELTA } from "../config/database";

const newGrata = async (
  direccion: number,
  anio: number,
  fecha_Fin: string,
  fecha_Inicio: string,
  presupuesto: number
) => {
  const pool1 = await getconectionVDBDELTA();

  //Ejecutar el procedimiento almacenado de SQL SERVER
  if (pool1 === false) {
    return;
  }
  try {
    const respond = await pool1
      .request()
      .query(`EXEC [dbo].[DATOS_GRATA] '${direccion}','${anio}'`);
    const { recordsets } = respond;
    if (Object.keys(recordsets[0]).length === 0) {
      return;
    }
    pool1.close();
    const pool = await getconectionGratas();
    if (pool === false) {
      return;
    }
    const data = JSON.stringify(recordsets[0]);
    const respondG = await pool.request().query(`USE GRATA
        EXEC [dbo].[createNewGrata] '${data}','${direccion}','${anio}','${fecha_Inicio}','${fecha_Fin}','${presupuesto}'`);
    const { recordsets: respond2 } = respondG;
    if (Object.keys(respond2).length === 0) {
      pool.close();
      return;
    } else {
      pool.close();
      return true;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export default newGrata;
