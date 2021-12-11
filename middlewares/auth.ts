import axios from "axios";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodeToken, IReqAuth } from "../interfaces";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(400).json({ message: "Invalid Authetication" });
    const decoded = <IDecodeToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded)
      return res.status(400).json({ message: "Invalid Authetication" });
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
    const { USUARIOID, NOMBRE, NOEMPLEADO, direcciones } = decoded;
    req.user = {
      USUARIOID,
      NOMBRE,
      NOEMPLEADO,
    };
    req.direcciones = direcciones;
    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export default auth;
