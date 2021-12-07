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
};

export default grataController;
