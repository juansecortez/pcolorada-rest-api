import { Request, Response } from "express";
import { getconectionGratas } from "../config/database";
import { IGrata, IReqAuth } from "../interfaces";
import newGrata from "../utils/createGrata";
import { sendEmail } from "../utils/sendEmail";
import {
  validateAuthorizeGrata,
  validateGrata,
  validateNumber,
} from "../utils/Validate";
import { validExistGrata } from "../utils/validGrata";

const grataController = {
  createGrata: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ message: "Invalid authentication." });
    if (req.user.role !== "Administrador")
      return res.status(401).json({
        message: "No cuentas con las credenciales para realizar esta acción",
      });
    try {
      const {
        presupuestoFinanzas,
        presupuestoMinas,
        presupuestoPelet,
        presupuestoRH,
        presupuestoGeneral,
        presupuestoBeneficio,
        presupuestoTec,
        presupuestoDirectores,
        anio,
        fechaInicio,
        fechaFin,
      }: IGrata = req.body;
      const errors = validateGrata(
        presupuestoFinanzas,
        presupuestoMinas,
        presupuestoPelet,
        presupuestoRH,
        presupuestoGeneral,
        presupuestoBeneficio,
        presupuestoTec,
        presupuestoDirectores,
        anio,
        fechaInicio,
        fechaFin
      );
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const valid = await validExistGrata(anio);
      if (valid.message === 1) {
        return res
          .status(403)
          .json({ message: `Ya existe una grata con el periodo ${anio}` });
      }
      await newGrata(1, anio, fechaFin, fechaInicio, presupuestoRH);
      await newGrata(2, anio, fechaFin, fechaInicio, presupuestoFinanzas);
      await newGrata(3, anio, fechaFin, fechaInicio, presupuestoMinas);
      await newGrata(4, anio, fechaFin, fechaInicio, presupuestoBeneficio);
      await newGrata(5, anio, fechaFin, fechaInicio, presupuestoPelet);
      await newGrata(6, anio, fechaFin, fechaInicio, presupuestoGeneral);
      await newGrata(7, anio, fechaFin, fechaInicio, presupuestoTec);
      await newGrata(8, anio, fechaFin, fechaInicio, presupuestoDirectores);
      let pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
        SELECT usuario_id from usuarios`);
      const workers = result.recordsets[0];
      workers.map(async (worker) => {
        await sendEmail(
          `${worker.usuario_id}@pcolorada.com`,
          `${process.env.URL_CLIENT}/Director`,
          `Inicia el proceso de asignación de bono por desempeño del periodo ${anio}`,
          anio
        );
      });
      pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result2 = await pool1.query(`USE GRATA
        EXEC getGrata ${anio}
      `);
      const workersGrata = result2.recordsets[0];
      pool1.close();
      return res
        .status(201)
        .json({ message: "Gratas creadas correctamente", workersGrata });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(400).json({ message: error.message });
    }
  },
  validateExistGrata: async (req: Request, res: Response) => {
    try {
      const { anio } = req.body;
      const result = await validExistGrata(anio);
      return res.json(result);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getGrata: async (req: Request, res: Response) => {
    // if (!req.user)
    //   return res.status(400).json({ message: "Invalid authentication." });
    try {
      const { year, idDirection }: any = req.query;
      const errors = [];
      if (!validateNumber(year)) {
        errors.push("El año debe de ser numerico");
      }
      if (!validateNumber(idDirection)) {
        errors.push("La dirección debe de ser numerica");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const valid = await validExistGrata(year);
      if (valid.message === 0) {
        return res
          .status(403)
          .json({ message: `No existe una grata con el periodo ${year}` });
      }
      let pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByEvaluation = await pool.query(`USE GRATA
      EXEC [dbo].[workersTotEvaluated] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByPotential = await pool.query(`USE GRATA
      EXEC [dbo].[workersTotByPotential] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByQualification = await pool.query(`USE GRATA
      EXEC [dbo].[workersTotByCalf] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const budgetGrata = await pool.query(`USE GRATA
      EXEC [dbo].[getPresupuestoGrata] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const actualBudgetGrata = await pool.query(`USE GRATA
      EXEC [dbo].[getActualBudgetGrata] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const commentsGrata = await pool.query(`USE GRATA
      SELECT p.comentarios FROM presupuestos p
      INNER JOIN periodos per on p.id_Periodo = per.id_Periodo
      where per.anio_periodo = ${year} and p.id_Direccion = ${idDirection}
      `);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const statusGrata = await pool.query(`USE GRATA
      EXEC [dbo].[getStatusGrata] ${year}, ${idDirection}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const workersGrata = await pool.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${year} and id_direccion = ${idDirection}`);
      pool.close();

      res.status(200).json({
        periodGrata: parseInt(year),
        statusGrata: statusGrata.recordsets[0][0].estatus,
        budgetGrata: budgetGrata.recordsets[0][0].presupuesto,
        commentsGrata: commentsGrata.recordsets[0][0].comentarios,
        actualBudgetGrata: actualBudgetGrata.recordsets[0][0].presupuesto_Final,
        totalWorkersByEvaluation: totalWorkersByEvaluation.recordsets[0],
        totalWorkersByPotential: totalWorkersByPotential.recordsets[0],
        totalWorkersByQualification: totalWorkersByQualification.recordsets[0],
        workersGrata: workersGrata.recordsets[0],
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  finishGrata: async (req: IReqAuth, res: Response) => {
    try {
      const { direccion, comentarios, anio } = req.body;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[finishGrata] '${comentarios}',${anio},${direccion}`);
      pool1.close();
      res.status(200).json({ message: result.recordsets[0][0].msg });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getDirecciones: async (req: Request, res: Response) => {
    try {
      const { anio } = req.body;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      select d.nombre_direccion,d.id from direccion d
      inner join presupuestos p on d.id = p.id_Direccion
      inner join periodos per on p.id_Periodo = per.id_Periodo 
      where per.anio_periodo = ${anio}`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getAnios: async (req: Request, res: Response) => {
    try {
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      select DISTINCT(anio_periodo) from periodos`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  authorizeGrata: async (req: Request, res: Response) => {
    try {
      const { anio, idDireccion, tipoAutorizacion, direccionAutorizacion } =
        req.body;
      const errors = validateAuthorizeGrata(
        anio,
        idDireccion,
        tipoAutorizacion,
        direccionAutorizacion
      );
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      [dbo].[autorizarGrata]
      @anio = ${anio},
      @direccion = ${idDireccion},
      @direccion_autorizacion = ${direccionAutorizacion},
      @tipo_autorizacion = ${tipoAutorizacion}`);
      pool1.close();
      res.status(200).json({ message: result.recordsets[0][0].msg });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getAuthGrata: async (req: Request, res: Response) => {
    try {
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[getGratasPeriodo]`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getYears: (req: Request, res: Response) => {
    try {
      let anios = [];
      let n = 0;
      let year = new Date();
      let newYear = year.getFullYear();
      let newyear = newYear - 3;
      while (n < 8) {
        n++;
        anios.push({ anio: newyear++ });
      }
      const anioss = [{ anio: 2020 }];
      res.json(anios);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getGratas: async (req: Request, res: Response) => {
    try {
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      select d.nombre_direccion,pre.presupuesto,pre.presupuesto_Final,
      p.anio_periodo from direccion d
      inner join presupuestos pre on d.id = pre.id_Direccion
      inner join periodos p on pre.id_Periodo = p.id_Periodo`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getStatusGrata: async (req: Request, res: Response) => {
    try {
      const { idDireccion, periodo } = req.query;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      select p.estatus from presupuestos pre
      inner join periodos p on pre.id_Periodo = p.id_Periodo
      where pre.id_Direccion = ${idDireccion} and p.anio_periodo = ${periodo}`);
      pool1.close();
      res.status(200).json(result.recordsets[0][0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
};
export default grataController;
