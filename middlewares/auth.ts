import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodeToken, IReqAuth } from "../interfaces";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    console.log("Middleware de autenticación ejecutado");
    
    // Obtener el token de la cabecera de la petición
    const token = req.header("Authorization");
    if (!token) {
      console.error("No se proporcionó el token de autenticación");
      return res.status(400).json({ message: "Invalid Authentication" });
    }

    // Verificar el token JWT
    const decoded = <IDecodeToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded) {
      console.error("Token no válido");
      return res.status(400).json({ message: "Invalid Authentication" });
    }
    
    console.log("Token JWT verificado correctamente:", decoded);

    // Verificar si el token tiene el campo USUARIOID
    if (!decoded.USUARIOID) {
      console.error("Token JWT no contiene USUARIOID");
      return res.status(401).json({ message: "Please login now!" });
    }

    // Si todo es correcto, asignamos el usuario a la solicitud
    const { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role } = decoded;
    req.user = {
      USUARIOID,
      NOMBRE,
      NOEMPLEADO,
      direcciones,
      role,
    };

    console.log("Autenticación exitosa para el usuario:", req.user);

    // Continuar con la siguiente función
    next();
  } catch (error: any) {
    console.error("Error en el middleware de autenticación:", error.message);
    
    // Si el token ha expirado, devolver un error específico
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Please login now!" });
    }

    // Devolver un error genérico si ocurre otro tipo de problema
    return res.status(500).json({ message: error.message });
  }
};

export default auth;
