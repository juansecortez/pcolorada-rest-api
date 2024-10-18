import { getconectionVDBGAMA } from "../config/database";

const newSucesion = async (
  anio: number,
  fecha_Fin: string,
  fecha_Inicio: string
) => {
  const pool = await getconectionVDBGAMA();
  if (!pool) {
    throw new Error("No hay conexión");
  }

  try {
    const respondG = await pool.request().query(`
      USE GRATA;
      EXEC [dbo].[createnewsucesion] @anio_periodo = ${anio}, 
                                     @fecha_Inicio = '${fecha_Inicio}', 
                                     @fecha_Fin = '${fecha_Fin}'
    `);

    const { recordsets: respond2 } = respondG;
    console.log(respondG.recordset);

    if (respond2.length === 0) {
      throw new Error("No se creó la sucesión");
    }
  } catch (error) {
    console.error("Error ejecutando el procedimiento almacenado:", error);
    throw new Error("Error en la creación de la sucesión");
  } finally {
    pool.close(); // Asegúrate de cerrar la conexión
  }
};

export default newSucesion;
