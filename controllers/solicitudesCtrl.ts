import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getconectionVDBGAMA } from "../config/database";

const solicitudesCtrl = {
  //Obtener solicitudes totales por fecha
  getSolicitudesTot: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      //Ejecutar el procedimiento almacenado de SQL SERVER
      if (pool === false) {
        return res
          .status(500)
          .json({ message: "La base datos no esta conectada" });
      }
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_TOTALES] '${fechaFin}','${fechaInicio}'`
        );
      //Enviar respuesta
      res.status(200).json(respond.recordset);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
  //Obtener solicitudes insumos por fecha
  getSolicitudesInsumos: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      if (pool === false) {
        return;
      }
      //Ejecutar el procedimiento almacenado de SQL SERVER
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_INSUMOS] '${fechaFin}','${fechaInicio}'`
        );
      //Enviar respuesta
      pool.close();
      res.status(200).json(respond.recordset);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
  //Obtener solicitudes servicios por fecha
  getSolicitudesServicios: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      if (pool === false) {
        return;
      }
      //Ejecutar el procedimiento almacenado de SQL SERVER
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_SERVICIOS] '${fechaFin}','${fechaInicio}'`
        );
      pool.close();
      //Enviar respuesta
      res.status(200).json(respond.recordset);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
  //Obtener solicitudes general por fecha
  getSolicitudesGeneral: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      if (pool === false) {
        return;
      }
      //Ejecutar el procedimiento almacenado de SQL SERVER
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_SERVICIOS] '${fechaFin}','${fechaInicio}'`
        );
      var tot = 0;
      respond.recordset.forEach((element) => {
        tot = tot + element.TOTAL_SOLPED;
      });
      const respond2 = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_INSUMOS] '${fechaFin}','${fechaInicio}'`
        );
      var tot2 = 0;
      respond2.recordset.forEach((element) => {
        tot2 = tot2 + element.TOTAL_SOLPED;
      });
      var tem = [
        { name: "Servicios", value: tot },
        { name: "Insumos", value: tot2 },
      ];
      pool.close();
      //Enviar respuesta
      res.status(200).json(tem);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
  //Obtener solicitudes grupo compra por fecha
  getSolicitudesGrupoCom: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      if (pool === false) {
        return;
      }
      //Ejecutar el procedimiento almacenado de SQL SERVER
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_GRUPOCOMPRAS] '${fechaFin}','${fechaInicio}'`
        );
      var data = respond.recordset;
      for (const compra in data) {
        console.log(data[compra].Grupo_Compras);
      }
      pool.close();
      //Enviar respuesta
      res.status(200).json(respond.recordset);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
  //Obtener solicitudes servicios por almacen
  getSolicitudesAlmacen: async (req: Request, res: Response) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { fechaInicio, fechaFin } = req.body;
      //Obtener la conexión
      const pool = await getconectionVDBGAMA();
      if (pool === false) {
        return;
      }
      //Ejecutar el procedimiento almacenado de SQL SERVER
      const respond = await pool
        .request()
        .query(
          `EXEC    [dbo].[SOLICITUDES_X_ALMACEN] '${fechaFin}','${fechaInicio}'`
        );
      pool.close();
      //Enviar respuesta
      res.status(200).json(respond.recordset);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Algo salió mal...",
      });
    }
  },
};
export default solicitudesCtrl;
