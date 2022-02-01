import { Request, Response } from "express";
import { getconectionGratas, getconectionVDBDELTA } from "../config/database";
import { validateInsertBonoFinal, validateNumber } from "../utils/Validate";
import { validExistGrata } from "../utils/validGrata";

const workersController = {
  insertBonoFinalWorker: async (req: Request, res: Response) => {
    try {
      const { codigo_Empleado, bono_Final, anio } = req.body;
      const errors = validateInsertBonoFinal(codigo_Empleado, bono_Final, anio);
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      let pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const worker = await pool1.query(
        `USE GRATA
        SELECT * FROM 
        Trabajadores where codigo_Empleado=${codigo_Empleado} and anio = ${anio}`
      );
      if (Object.keys(worker.recordsets[0]).length === 0) {
        return res.status(404).json({
          message: `No se encontro el empledo con el codigo: ${codigo_Empleado} en el año ${anio}`,
        });
      }
      pool1.close();
      pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      await pool1.query(`USE GRATA
      UPDATE Trabajadores set bono_Final = ${bono_Final}, fecha_Actualizacion = CURRENT_TIMESTAMP
      where codigo_Empleado = ${codigo_Empleado} and anio = ${anio}`);
      const result = await pool1.query(
        `USE GRATA
        SELECT * FROM 
        Trabajadores where codigo_Empleado=${codigo_Empleado} and anio = ${anio}`
      );
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  updateWorkersBonoFinalAverage: async (req: Request, res: Response) => {
    try {
      const { idDirection, year } = req.body;
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
          .json({ message: `No existe una periodo con el año ${year}` });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalPromedio] ${idDirection}, ${year}`);
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  updateWorkersBonoFinalMax: async (req: Request, res: Response) => {
    try {
      const { idDirection, year } = req.body;
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
          .json({ message: `No existe una periodo con el año ${year}` });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalMaximo] ${idDirection}, ${year}`);
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  updateWorkersBonoFinalMin: async (req: Request, res: Response) => {
    try {
      const { idDirection, year } = req.body;
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
          .json({ message: `No existe un periodo con el año ${year}` });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalMinimo] ${idDirection}, ${year}`);
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getDirectionsByUserId: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const directions = await pool1.query(
        `USE GRATA EXEC [dbo].[getDirectionsByUserID] '${userId}' `
      );
      pool1.close();
      res.json(directions.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkerHistory: async (req: Request, res: Response) => {
    try {
      const { codWorker } = req.body;
      const errors = [];
      if (!validateNumber(codWorker)) {
        errors.push("El codigo de empleado debe ser numerico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionVDBDELTA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const workerHistory = await pool1.query(
        `EXEC [dbo].[sp_obtenercalif_historial] ${codWorker} `
      );
      pool1.close();
      res.json(workerHistory.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersByDirection: async (req: Request, res: Response) => {
    try {
      const { idDirection, year } = req.body;
      let errors = [];
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
          .json({ message: `No existe un periodo con el año ${year}` });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      
      const result = await pool1.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${year} and id_direccion = ${idDirection}`);
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
};

export default workersController;
