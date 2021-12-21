import { Request, Response } from "express";
import axios from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken";
import jwt from "jsonwebtoken";
import { IDecodeToken, IUserData } from "../interfaces";
import { getconectionGratas } from "../config/database";

const authCtrl = {
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/api/v1/auth/refresh_token",
      });
      return res.json({ message: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ message: "No hay servicio" });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      console.log(req.cookies.refreshtoken)
      if (!rf_token)
        return res.status(401).json({ message: "Please login now!" });
      console.log("hire");
      const decoded = <IDecodeToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.USUARIOID)
        return res.status(401).json({ message: "Please login now!" });

      const params = new URLSearchParams();
      params.append("usuarioid", decoded.USUARIOID);
      const result = await axios.post(
        "http://vwebdelta/WebDataSap/Service1.asmx/EXISTE_USUARIO",
        params
      );
      if (typeof result.data === "string") {
        return res.json({ message: "No existe el usuario" });
      }
      const user: IUserData = result.data[0];
      if (!user)
        return res
          .status(400)
          .json({ message: "This account does not exist." });
      const { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role } = decoded;
      const access_token = generateAccessToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        direcciones,
      });
      res.json({
        access_token,
        user: { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role },
      });
    } catch (error: any) {
      return res.status(500).json({ message: "No hay servicio" });
    }
  },
  loginSOAP: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const pool2 = await getconectionGratas();
      if (pool2 === false) {
        return;
      }
      const resul = await pool2.query(`USE GRATA
      SELECT * FROM usuarios WHERE usuario_id = '${username}'`);
      if (Object.keys(resul.recordsets[0]).length === 0) {
        return res.status(401).json({
          message: "No cuentas con las credenciales para acceder al sistema",
        });
      }
      const role = resul.recordsets[0][0].role;
      pool2.close();
      const params = new URLSearchParams();
      params.append("usuario", username);
      params.append("contrasena", password);
      const result = await axios.post(
        "http://vwebdelta/WebDataSap/Service1.asmx/VALIDA_USUARIO",
        params
      );

      if (Object.keys(result.data).length === 0) {
        return res.status(401).json({
          message: "No cuentas con las credenciales para acceder al sistema",
        });
      }
      if (typeof result.data === "string") {
        return res.status(401).json({ message: "El usuario o la contraseña estan mal" });
      }
      const user: IUserData = result.data[0];
      const { USUARIOID, NOMBRE, NOEMPLEADO } = user;
      const pool1 = await getconectionGratas();
      if (pool1 === false) {
        return;
      }
      var direcciones = [];
      const resultado = await pool1.query(`USE GRATA
      SELECT id_direccion as IdDireccion FROM usuarios_direcciones WHERE id_usuario = '${USUARIOID}'`);
      for (var value in resultado.recordsets[0]) {
        direcciones.push(resultado.recordsets[0][value].IdDireccion);
      }
      pool1.close();
      const access_token = generateAccessToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        direcciones,
        role,
      });
      const refresh_token = generateRefreshToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        direcciones,
        role,
      });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 172_800_000, //  Dos dias
      });
      res.json({
        message: "Login Success!",
        access_token,
        user: {
          USUARIOID,
          NOMBRE,
          NOEMPLEADO,
          direcciones,
          role,
        },
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: "No hay servicio" });
    }
  },
};
export default authCtrl;
