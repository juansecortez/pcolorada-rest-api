import { Request, Response } from "express";
import { getconectionGratas } from "../config/database";
import { IGrata, IReqAuth } from "../interfaces";
import newGrata from "../utils/createGrata";
import { getGrata } from "../utils/getGrata";
import { sendEmail } from "../utils/sendEmail";
import { validateAuthorizeGrata, validateGrata } from "../utils/Validate";
import { validExistGrata } from "../utils/validGrata";

const grataController = {
  createGrata: async (req: Request, res: Response) => {
    // if (!req.user)
    //   return res.status(400).json({ msg: "Invalid authentication." });
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
      console.log({
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
      });
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
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
        SELECT usuario_id from usuarios`);
      const workers = result.recordsets[0];
      console.log(workers);
      // workers.map(async (worker) => {
      //   await sendEmail(
      //     `${worker.usuario_id}@pcolorada.com`,
      //     `${process.env.URL_BASE_API}/Director`,
      //     `Inicia el proceso de asignación de bono por desempeño del periodo ${anio}`,
      //     anio
      //   );
      // });
      pool1.close();
      return res.status(200).json({ message: "Gratas creadas correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.json({ message: error.message });
    }
  },
  validateExistGrata: async (req: Request, res: Response) => {
    try {
      const { anio } = req.body;
      const result = await validExistGrata(anio);
      return res.json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  getPresupuestoGrata: async (req: Request, res: Response) => {
    try {
      const { periodo, idDireccion } = req.query;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
      EXEC getPresupuestoGrata ${periodo},${idDireccion}`);
      pool1.close();
      res.status(200).json(result.recordsets[0][0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  finishGrata: async (req: IReqAuth, res: Response) => {
    try {
      const { direccion, comentarios, anio } = req.body;
      console.log({ direccion, comentarios, anio });
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
      EXEC [dbo].[finishGrata] '${comentarios}',${anio},${direccion}`);
      pool1.close();
      res.status(200).json({ message: result.recordsets[0][0].msg });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getDirecciones: async (req: Request, res: Response) => {
    try {
      const { anio } = req.body;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
      select d.nombre_direccion,d.id from direccion d
      inner join presupuestos p on d.id = p.id_Direccion
      inner join periodos per on p.id_Periodo = per.id_Periodo 
      where per.anio_periodo = ${anio}`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAnios: async (req: Request, res: Response) => {
    try {
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
      select DISTINCT(anio_periodo) from periodos`);
      pool1.close();
      res.status(200).json(result.recordsets[0]);
    } catch (error: any) {
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
        return;
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
      return res.status(500).json({ message: error.message });
    }
  },
  getAuthGrata: async (req: Request, res: Response) => {
    try {
      const { idDireccion, anio } = req.query;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      const result = await pool1.query(`USE GRATA
      select per.autorizacion_rh,per.autorizacion_general from direccion d
      inner join presupuestos p on d.id = p.id_Direccion
      inner join periodos per on p.id_Periodo = per.id_Periodo 
      where d.id = ${idDireccion} and per.anio_periodo = ${anio}`);
      pool1.close();
      res.status(200).json(result.recordsets[0][0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  getYears: (req: Request, res: Response) => {
    try {
      let anios = [];
      let n = 0;
      let year = new Date();
      let newYear = year.getFullYear();
      let newyear = newYear - 1;
      while (n < 5) {
        n++;
        anios.push({ anio: newyear++ });
      }
      res.json(anios);
    } catch (error: any) {
      console.log(error);
    }
  },
};
export default grataController;
