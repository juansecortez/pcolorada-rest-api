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
const axios_1 = __importDefault(require("axios"));
const generateToken_1 = require("../config/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const authCtrl = {
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie("refreshtoken", {
                path: "/api/v1/auth/refresh_token",
            });
            return res.json({ message: "Logged out!" });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: "No hay servicio" });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res.status(401).json({ message: "Please login now!" });
            const decoded = (jsonwebtoken_1.default.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`));
            if (!decoded.USUARIOID)
                return res.status(401).json({ message: "Please login now!" });
            const params = new URLSearchParams();
            params.append("usuarioid", decoded.USUARIOID);
            const result = yield axios_1.default.post("http://vwebdelta/WebDataSap/Service1.asmx/EXISTE_USUARIO", params);
            if (typeof result.data === "string") {
                return res.json({ message: "No existe el usuario" });
            }
            const user = result.data[0];
            if (!user)
                return res
                    .status(400)
                    .json({ message: "This account does not exist." });
            const { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role } = decoded;
            const access_token = (0, generateToken_1.generateAccessToken)({
                USUARIOID,
                NOMBRE,
                NOEMPLEADO,
                direcciones,
                role,
            });
            res.json({
                access_token,
                user: { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role },
            });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: "No hay servicio" });
        }
    }),
    loginSOAP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const pool2 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool2 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const resul = yield pool2.query(`USE GRATA
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
            const result = yield axios_1.default.post("http://vwebdelta/WebDataSap/Service1.asmx/VALIDA_USUARIO", params);
            if (Object.keys(result.data).length === 0) {
                return res.status(401).json({
                    message: "No cuentas con las credenciales para acceder al sistema",
                });
            }
            if (typeof result.data === "string") {
                return res
                    .status(401)
                    .json({ message: "El usuario o la contraseña estan mal" });
            }
            const user = result.data[0];
            const { USUARIOID, NOMBRE, NOEMPLEADO } = user;
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            var direcciones = [];
            const resultado = yield pool1.query(`USE GRATA
      SELECT id_direccion as IdDireccion FROM usuarios_direcciones WHERE id_usuario = '${USUARIOID}'`);
            for (var value in resultado.recordsets[0]) {
                direcciones.push(resultado.recordsets[0][value].IdDireccion);
            }
            pool1.close();
            const access_token = (0, generateToken_1.generateAccessToken)({
                USUARIOID,
                NOMBRE,
                NOEMPLEADO,
                direcciones,
                role,
            });
            const refresh_token = (0, generateToken_1.generateRefreshToken)({
                USUARIOID,
                NOMBRE,
                NOEMPLEADO,
                direcciones,
                role,
            });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/api/v1/auth/refresh_token",
                maxAge: 7200000, //  Dos horas
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
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: "No hay servicio" });
        }
    }),
};
exports.default = authCtrl;
