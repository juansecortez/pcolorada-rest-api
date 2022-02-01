import { Request, Response } from "express";
import { getconectionGratas } from "../config/database";
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
      let pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByPotential = await pool.query(`USE GRATA
    EXEC [dbo].[workersTotByPotentialPeriod] ${year}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const totalWorkersByQualification = await pool.query(`USE GRATA
      EXEC [dbo].[workersTotByCalfPeriod] ${year}`);
      pool.close();
      pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      pool = await getconectionGratas();
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
      res.status(200).json({
        periodPeriod: parseInt(year),
        budgetPeriod: presupuesto,
        actualBudgetPeriod: presupuesto_Real,
        totalWorkersByPotential: totalWorkersByPotential.recordsets[0],
        totalWorkersByQualification: totalWorkersByQualification.recordsets[0],
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
  authPeriod: async (req: Request, res: Response) => {
    try {
      const { year }: any = req.body;
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
      let pool = await getconectionGratas();
      if (pool === false) {
        return res.status(400).json({ message: "No hay servicio" });
      }
      const result = await pool.query(`USE GRATA
      select estatus from periodos where anio_periodo = ${year}`);
      const { recordsets } = result;
      const estatus = recordsets[0][0].estatus;
      pool.close();
      if (estatus === 0) {
        console.log("0");
        return res.status(200).json({ message: "Pendiente de finalizar" });
      } else if (estatus === 1) {
        console.log("1");
        pool = await getconectionGratas();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const resul = await pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion=1`);
        const data = resul.recordsets[0];
        const user: IUserDirection = data[0];
        console.log(data);
        await sendEmail(
          `${user.usuario_id}@pcolorada.com`,
          `${process.env.URL_CLIENT}/login`,
          `Autorizar periodo de asignación ${year}`,
          `Autorizar periodo de asignación ${year}`
        )
          .catch((error) => {
            console.log({ message: error.message });
            throw new Error("No se envio el correo");
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Periodo enviado para autorización" });
          });
        pool.close();
        return res.status(200).json({
          message: "Periodo enviado para autorización recursos humanos",
        });
      } else if (estatus === 2) {
        pool = await getconectionGratas();
        if (pool === false) {
          return res.status(400).json({ message: "No hay servicio" });
        }
        const resul = await pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion=6`);
        const data = resul.recordsets[0];
        const user: IUserDirection = data[0];
        await sendEmail(
          `${user.usuario_id}@pcolorada.com`,
          `${process.env.URL_CLIENT}/login`,
          `Autorizar periodo de asignación ${year}`,
          `Autorizar periodo de asignación ${year}`
        )
          .catch((error) => {
            console.log({ message: error.message });
            throw new Error("No se envio el correo");
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Periodo enviado para autorización" });
          });
        pool.close();
        return res
          .status(200)
          .json({ message: "Periodo enviado para autorización " });
      } else {
        return res.status(200).json({ message: "Autorizada para el pago" });
      }
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: error.message });
    }
  },
};
export default periodController;
