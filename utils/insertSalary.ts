import { getconectionVDBGAMA } from "../config/database";
import { IDataExcel } from "../interfaces";

export const insertSalary = async (data: IDataExcel, year: number) => {
  const pool = await getconectionVDBGAMA();
  if (pool === false) {
    throw new Error("No hay conexión");
  }
  await pool
    .query(
      `USE GRATA
            EXEC [dbo].[InisertSalarios] ${data.codigo},${data.salariomensual},${data.bonoanterior},${year}`
    )
    .catch((error) => {
      throw new Error(error);
    });
};
