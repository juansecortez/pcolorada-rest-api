import { Request, Response } from "express";
import { getconectionGratas } from "../config/database";
import { validateInsertBonoFinal } from "../utils/Validate";

const grataController = {
  getWorkersByYear: async (req: Request, res: Response) => {
    try {
      const { anio, direccion } = req.body;
      if (isNaN(parseInt(anio))) {
        res.status(400).json({ message: "El año debe de ser numerico" });
      }
      if (isNaN(parseInt(direccion))) {
        res.status(400).json({ message: "La dirección debe de ser numerica" });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const workers = await pool1.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${anio} and id_direccion = ${direccion}`);
      pool1.close();
      return res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  insertBonoFinalWorker: async (req: Request, res: Response) => {
    try {
      const { codigo_Empleado, bono_Final, anio } = req.body;
      const errors = validateInsertBonoFinal(codigo_Empleado, bono_Final, anio);
      if (errors.length > 0) {
        return res.status(400).json({ message: errors });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
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
      await pool1.query(`USE GRATA
      UPDATE Trabajadores set bono_Final = ${bono_Final}
      where codigo_Empleado = ${codigo_Empleado} and anio = ${anio}`);
      const result = await pool1.query(
        `USE GRATA
        SELECT * FROM 
        Trabajadores where codigo_Empleado=${codigo_Empleado} and anio = ${anio}`
      );
      pool1.close();
      return res.json(result.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersByDirection: async (req: Request, res: Response) => {
    try {
      const direction = parseInt(req.params.direction);
      if (isNaN(direction)) {
        return res
          .status(400)
          .json({ message: "La dirección tiene que se un numero" });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const workers = await pool1.query(
        `USE GRATA select t.* from periodos p
        inner join Trabajadores t ON p.id_Periodo = t.id_periodo 
        where p.estatus = 1 and t.id_direccion = ${direction}`
      );
      pool1.close();
      return res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkers: async (req: Request, res: Response) => {
    try {
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const anio = 2020;
      const workers = await pool1.query(
        `USE GRATA SELECT * FROM Trabajadores where anio = ${anio}`
      );
      pool1.close();
      return res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersTotByCalf: async (req: Request, res: Response) => {
    try {
      const { anio, direction } = req.body;
      if (isNaN(parseInt(anio))) {
        return res.status(400).json({ message: "El año debe de ser numerico" });
      }
      if (isNaN(parseInt(direction))) {
        return res
          .status(400)
          .json({ message: "La dirección debe de ser numerica" });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const workers = await pool1.query(`USE GRATA
      EXEC [dbo].[workersTotByCalf] ${anio}, ${direction}`);
      res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersTotByPotential: async (req: Request, res: Response) => {
    try {
      const { anio, direction } = req.body;
      if (isNaN(parseInt(anio))) {
        return res.status(400).json({ message: "El año debe de ser numerico" });
      }
      if (isNaN(parseInt(direction))) {
        return res
          .status(400)
          .json({ message: "La dirección debe de ser numerica" });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const workers = await pool1.query(`USE GRATA
      EXEC [dbo].[workersTotByPotential] ${anio}, ${direction}`);
      res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getWorkersTotEvaluated: async (req: Request, res: Response) => {
    try {
      const { anio, direction } = req.body;
      if (isNaN(parseInt(anio))) {
        return res.status(400).json({ message: "El año debe de ser numerico" });
      }
      if (isNaN(parseInt(direction))) {
        return res
          .status(400)
          .json({ message: "La dirección debe de ser numerica" });
      }
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const workers = await pool1.query(`USE GRATA
      EXEC [dbo].[workersTotEvaluated] ${anio}, ${direction}`);
      res.json(workers.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default grataController;
