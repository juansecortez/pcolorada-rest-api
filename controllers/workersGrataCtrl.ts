import { Request, Response } from "express";
import {  getconectionVDBGAMA } from "../config/database";
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
      let pool1 = await getconectionVDBGAMA();
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
      pool1 = await getconectionVDBGAMA();
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
      const pool1 = await getconectionVDBGAMA();
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
      const pool1 = await getconectionVDBGAMA();
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
      const pool1 = await getconectionVDBGAMA();
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
      const pool1 = await getconectionVDBGAMA();
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
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const workerHistory = await pool1.query(
        `USE GRATA EXEC [dbo].[sp_obtenercalif_historial] ${codWorker} `
      );
      pool1.close();
      res.json(workerHistory.recordsets[0]);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkerLastRating: async (req: Request, res: Response) => {
    try {
      const { codWorker } = req.body;
      const errors = [];
  
      // Validación: El código de empleado debe ser numérico
      if (!validateNumber(codWorker)) {
        errors.push("El código de empleado debe ser numérico");
      }
      
      // Si hay errores, devolver respuesta 400
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
  
      // Obtener la conexión a la base de datos
      const pool1 = await getconectionVDBGAMA();
  
      // Verificar si la conexión falló
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
  
      // Ejecutar el procedimiento almacenado que obtiene la última calificación anterior
      const lastRating = await pool1.query(
        `USE GRATA EXEC [dbo].[sp_obtenercalif_anterior] ${codWorker}`
      );
      
      // Cerrar la conexión a la base de datos
      pool1.close();
  
      // Devolver el resultado de la consulta
      res.json(lastRating.recordsets[0]);
    } catch (error: any) {
      // Capturar errores y devolver respuesta 500
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  getPotencialAndNivelFirma : async (req: Request, res: Response) => {
    try {
      const { anio, id_direccion } = req.body;
      const errors = [];
  
      // Validar que los parámetros sean numéricos
      if (!validateNumber(anio)) {
        errors.push("El año debe ser numérico");
      }
      if (!validateNumber(id_direccion)) {
        errors.push("El id_direccion debe ser numérico");
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
  
      // Obtener la conexión a la base de datos
      const pool1 = await getconectionVDBGAMA();
      if (pool1 === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
  
      // Ejecutar el procedimiento almacenado con los parámetros
      const result = await pool1.query(
        `USE GRATA EXEC [dbo].[sp_obtener_potencial_nivelfirma] ${anio}, ${id_direccion}`
      );
      
      // Cerrar la conexión a la base de datos
      pool1.close();
  
      // Devolver el resultado de la consulta
      res.json(result.recordsets[0]);
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
      const pool1 = await getconectionVDBGAMA();
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
