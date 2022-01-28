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
    throw new Error("No hay conexión");
  }
  const respond = await pool1
    .request()
    .query(`EXEC [dbo].[DATOS_GRATA] '${direccion}','${anio}'`);
  const { recordsets } = respond;
  if (Object.keys(recordsets[0]).length === 0) {
    pool1.close();
    throw new Error(`La grata del ${anio} no existe`);
  }
  pool1.close();
  const pool = await getconectionGratas();
  if (pool === false) {
    throw new Error("No hay conexión");
  }
  const data = JSON.stringify(recordsets[0]);
  const respondG = await pool.request().query(`USE GRATA
        EXEC [dbo].[createNewGrata] '${data}','${direccion}','${anio}','${fecha_Inicio}','${fecha_Fin}','${presupuesto}'`);
  const { recordsets: respond2 } = respondG;
  if (Object.keys(respond2).length === 0) {
    pool.close();
    throw new Error("No se creo la grata");
  }
  pool.close();
  pool1.close();
};

export default newGrata;
