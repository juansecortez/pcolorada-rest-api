import { Request, Response } from "express";
import ActiveDirectory from "activedirectory2";
import axios from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken";
import jwt from "jsonwebtoken";
import { IDecodeToken, IUserData } from "../interfaces";
export const configActiveDirectory = {
  url: `${process.env.AD_DOMAIN}`,
  username: `${process.env.AD_USER}`,
  password: `${process.env.AD_PASSWORD}`,
  baseDN: ``,
};

const authCtrl = {
  loging: async (req: Request, res: Response) => {
    var ad = new ActiveDirectory(configActiveDirectory);
    console.log(configActiveDirectory, ad);
    const { username, password } = req.body;
    ad.authenticate(username, password, (err: any, auth) => {
      if (err) {
        console.log(err);
        if (err.code === 49) {
          return res.status(500).json({ msg: "Servidor no disponible" });
        }
        let error: any = JSON.stringify(err);
        if (error.includes("ENOTFOUND")) {
          return res.status(500).json({ msg: "Servidor no disponible" });
        }
        if (error.includes("ETIMEDOUT")) {
          return res.status(500).json({ msg: "Servidor no disponible" });
        }
      }
      try {
        if (auth) {
          const access_token = generateAccessToken({ username });
          const refresh_token = generateRefreshToken({ username });
          res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/refresh_token",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
          res.json({
            msg: "Login Success!",
            access_token,
          });
        } else {
          console.log(err);
          console.log(auth);
          res
            .status(404)
            .json({ msg: "El usuario o la contraseña son incorrectos" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ msg: "Ocurrio un error contacte con el administrador" });
      }
    });
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/api/refresh_token",
      });
      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
      const decoded = <IDecodeToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.username)
        return res.status(400).json({ msg: "Please login now!" });
      const access_token = generateAccessToken({ username: decoded.username });
      res.json({ access_token, username: decoded.username });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  loginSOAP: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const params = new URLSearchParams();
      params.append("usuario", username);
      params.append("contrasena", password);
      const result = await axios.post(
        "http://vwebdelta/WebDataSap/Service1.asmx/VALIDA_USUARIO",
        params
      );
      if (typeof result.data === "string") {
        return res.json({ message: "El usuario o la contraseña estan mal" });
      }
      const user: IUserData = result.data[0];
      const access_token = generateAccessToken({ id: user.USUARIOID });
      const refresh_token = generateRefreshToken({ id: user.USUARIOID });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.json({
        msg: "Login Success!",
        access_token,
        user,
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: "No hay servicio" });
    }
  },
};
export default authCtrl;
