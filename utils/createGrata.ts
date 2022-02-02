import { getconectionVDBGAMA } from "../config/database";

const newGrata = async (
  anio: number,
  fecha_Fin: string,
  fecha_Inicio: string,
  presupuestoRH: number,
  presupuestoFinanzas: number,
  presupuestoMinas: number,
  presupuestoBeneficio: number,
  presupuestoPelet: number,
  presupuestoGeneral: number,
  presupuestoTec: number,
  presupuestoDirectores: number
) => {
  const pool = await getconectionVDBGAMA();
  if (pool === false) {
    throw new Error("No hay conexión");
  }
  const respondG = await pool.request().query(`USE GRATA
        EXEC [dbo].[createnewGrata_v1] '${anio}',
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
