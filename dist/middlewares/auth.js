"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Middleware de autenticación ejecutado");
        // Obtener el token de la cabecera de la petición
        const token = req.header("Authorization");
        if (!token) {
            console.error("No se proporcionó el token de autenticación");
            return res.status(400).json({ message: "Invalid Authentication" });
        }
        // Verificar el token JWT
        const decoded = (jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`));
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
    }
    catch (error) {
        console.error("Error en el middleware de autenticación:", error.message);
        // Si el token ha expirado, devolver un error específico
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Please login now!" });
        }
        // Devolver un error genérico si ocurre otro tipo de problema
        return res.status(500).json({ message: error.message });
    }
});
exports.default = auth;
