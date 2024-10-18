import { Request, Response } from "express";
import { getconectionOrganigrama, getconectionVDBGAMA } from "../config/database";
import { getconectionVDBDELTA } from "../config/database";
import { IUserDirection } from "../interfaces";
import { sendEmail } from "../utils/sendEmail";
import { validateNumber } from "../utils/Validate";
import { validExistGrata } from "../utils/validGrata";

const periodController = {
  getPeriod: async (req: Request, res: Response) => {
    try {
      const { year }: any = req.query;
      const errors = [];
      if (!validateNumber(year)) {
        errors.push("El año debe de ser numerico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const valid = await validExistGrata(year);
      if (valid.message !== 1) {
        return res
          .status(403)
          .json({ message: `No existe el periodo ${year}` });
      }
      let pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByPotential = await pool.query(`USE GRATA
    EXEC [dbo].[workersTotByPotentialPeriod] ${year}`);
      pool.close();
      pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByQualification = await pool.query(`USE GRATA
      EXEC [dbo].[workersTotByCalfPeriod] ${year}`);
      pool.close();
      pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const workersByPeriod = await pool.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${year}`);

      const result = await pool.query(`USE GRATA
      EXEC [dbo].[getPresupuestoPeriodo] ${year}`);
      const { recordsets } = result;
      const { presupuesto, presupuesto_Real } = recordsets[0][0];
      pool.close();
      pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const data = await pool.query(`USE GRATA
      EXEC [dbo].[promedioMatriz] ${0},${year}`);
      const resul: any = data.recordsets;
      let averagePeriod: number[] = [];
      resul[0].map((element: any) => {
        averagePeriod = [...averagePeriod, element.promedio];
      });
      pool.close();
      return res.status(200).json({
        periodPeriod: parseInt(year),
        budgetPeriod: presupuesto,
        actualBudgetPeriod: presupuesto_Real,
        totalWorkersByPotential: totalWorkersByPotential.recordsets[0],
        totalWorkersByQualification: totalWorkersByQualification.recordsets[0],
        averagePeriod: averagePeriod,
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  authPeriod: async (req: Request, res: Response) => {
    try {
      const { year, estatus }: any = req.body;
      const errors = [];
      if (!validateNumber(year)) {
        errors.push("El año debe de ser numerico");
      }
      if (!validateNumber(estatus)) {
        errors.push("El año debe de ser numerico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const valid = await validExistGrata(year);
      if (valid.message !== 1) {
        return res
          .status(403)
          .json({ message: `No existe el periodo ${year}` });
      }
      let pool = await getconectionVDBGAMA();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      if (estatus === 0) {
        return res.status(403).json({ message: "Pendiente de finalizar" });
      } else if (estatus === 1) {
        pool = await getconectionVDBGAMA();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const resul = await pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 1`);
        const data = resul.recordsets[0];
        const user: IUserDirection = data[0];
        await sendEmail(
          `${user.usuario_id}@pcolorada.com`,
          `http://vwebgama:5002/login`,
          `Autorizar periodo de asignación ${year}`,
          `Autorizar periodo de asignación ${year}`
        ).catch((error) => {
          console.log({ message: error.message });
          throw new Error("No se envio el correo");
        });
        pool.close();
        return res.status(200).json({
          message: "Periodo enviado para autorización dirección de recursos humanos",
        });
      } else if (estatus === 2) {
        pool = await getconectionVDBGAMA();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const result = await pool.query(`USE GRATA
        update periodos set estatus = 2 where anio_periodo = ${year}
        `);
        pool.close();
        pool = await getconectionVDBGAMA();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const resul = await pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 6`);
        const data = resul.recordsets[0];
        const user: IUserDirection = data[0];
        await sendEmail(
          `${user.usuario_id}@pcolorada.com`,
          `http://vwebgama:5002/login`,
          `Autorizar periodo de asignación ${year}`,
          `Autorizar periodo de asignación ${year}`
        ).catch((error) => {
          console.log({ message: error.message });
          throw new Error("No se envio el correo");
        });
        pool.close();
        return res
          .status(200)
          .json({ message: "Periodo enviado para autorización dirección general" });
      } else if (estatus === 3) {
        pool = await getconectionVDBGAMA();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        await pool.query(`USE GRATA
        update periodos set estatus = 3 where anio_periodo = ${year}
        `);
        pool.close();

        pool = await getconectionVDBGAMA();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const resul = await pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 1`);
        const data = resul.recordsets[0];
        const user: IUserDirection = data[0];
        await sendEmail(
          `${user.usuario_id}@pcolorada.com`,
          `http://vwebgama:5002/login`,
          `Autorizar periodo de asignación ${year}`,
          `El proceso de bono del ${year} ha sido autorizado por dirección general y dirección de recursos humanos`
        ).catch((error) => {
          console.log({ message: error.message });
          throw new Error("No se envio el correo");
        });
        pool.close();
        return res.status(200).json({ message: "Periodo autorizado" });
      }
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getAniosPeriodByUser: async (req: Request, res: Response) => {
    try {
      const { estatus }: any = req.query;
      const errors = [];
      if (!validateNumber(estatus)) {
        errors.push("El estatus de ser numerico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
SELECT anio_periodo 
FROM periodos 
WHERE estatus = ${estatus} 
AND proceso = 'Bono'`);
      pool1.close();
      return res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  averageMatrix: async (req: Request, res: Response) => {
    try {
      const { idDirection, year }: any = req.query;
      const errors = [];
      if (!validateNumber(idDirection)) {
        errors.push("La dirección de ser numérica");
      }
      if (!validateNumber(year)) {
        errors.push("El año de ser numérico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const data = await pool1.query(`USE GRATA
      EXEC [dbo].[promedioMatriz] ${idDirection},${year}`);
      const result: any = data.recordsets;
      let averagePeriod: number[] = [];
      result[0].map((element: any) => {
        averagePeriod = [...averagePeriod, element.promedio];
      });
      pool1.close();
      return res.status(200).json(averagePeriod);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  sendEmailPeriod: async (req: Request, res: Response) => {
    try {
      const { year }: any = req.body;
      const errors = [];
      if (!validateNumber(year)) {
        errors.push("El año de ser numérico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      await pool1.query(`USE GRATA EXEC [dbo].[EnvioCorreoBono] ${year}`);
      pool1.close();
      return res
        .status(200)
        .json({ message: "Correos enviados a todos los trabajadores" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersByPeriod: async (req: Request, res: Response) => {
    try {
      const { year }: any = req.body;
      const errors = [];
      if (!validateNumber(year)) {
        errors.push("El año de ser numérico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(
        `USE GRATA EXEC [dbo].[getWorkersByPeriod] ${year}`
      );
      const workersData = result.recordsets;
      pool1.close();
      return res.status(200).json(workersData);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getPeriodsByBono: async (req: Request, res: Response) => {
    try {
        const pool = await getconectionVDBGAMA();
        if (!pool) {
            return res.status(400).json({ message: "No hay servicio" });
        }

        const result = await pool.query(`
            USE GRATA;
            SELECT * FROM periodos WHERE proceso = 'Bono'
        `);
        pool.close();

        return res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({ message: error.message });
    }
},
getPeriodsBySucesion: async (req: Request, res: Response) => {
  try {
      const pool = await getconectionVDBGAMA();
      if (!pool) {
          return res.status(400).json({ message: "No hay servicio" });
      }

      const result = await pool.query(`
          USE GRATA;
          SELECT * FROM periodos WHERE proceso = 'Sucesion'
      `);
      pool.close();

      return res.status(200).json(result.recordsets[0]);
  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
  }
},
getPeopleBySucesion: async (req: Request, res: Response) => {
  try {
    console.log("Iniciando función getPeopleBySucesion");

    // Extraer el id_direccion desde el cuerpo de la petición
    console.log("Body de la petición:", req.body);
    const { id_direccion }: any = req.body;

    // Validar que se recibió un id_direccion
    if (!id_direccion) {
      console.error("id_direccion no proporcionado");
      return res.status(400).json({ message: "El id_direccion es requerido" });
    }

    // Validar que id_direccion es numérico
    if (isNaN(id_direccion)) {
      console.error("id_direccion no es numérico:", id_direccion);
      return res.status(400).json({ message: "El id_direccion debe ser numérico" });
    }

    console.log("id_direccion validado:", id_direccion);

    // Obtener la conexión
    console.log("Intentando obtener la conexión a la base de datos");
    const pool = await getconectionVDBGAMA(); 
    if (!pool) {
      console.error("No se pudo obtener la conexión a la base de datos");
      return res.status(400).json({ message: "No hay servicio" });
    }
    console.log("Conexión a la base de datos establecida con éxito");

    // Hacer la consulta a la vista usando el id_direccion
    console.log("Ejecutando consulta SQL para id_direccion:", id_direccion);
    const result = await pool.request()
      .input('id_direccion', id_direccion)
      .query(`
        USE GRATA;
        SELECT * 
        FROM [grata].[dbo].[View_PeopleBySucesion]
        WHERE id_direccion = @id_direccion
      `);

    // Log de los resultados de la consulta
    console.log("Resultado de la consulta SQL:", result.recordsets);

    // Cerrar la conexión
    pool.close();
    console.log("Conexión a la base de datos cerrada correctamente");

    if (result.recordsets.length === 0) {
      console.error("No se encontraron resultados para id_direccion:", id_direccion);
      return res.status(404).json({ message: "No se encontraron resultados" });
    }

    // Devolver los resultados
    console.log("Devolviendo resultados correctamente");
    return res.status(200).json(result.recordsets[0]);

  } catch (error: any) {
    console.error("Error capturado en getPeopleBySucesion:", {
      message: error.message,
      stack: error.stack,
      detail: error
    });
    return res.status(500).json({
      message: "Error en el servidor",
      detail: error.message,
      stack: error.stack
    });
  }
},


};
export default periodController;
