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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("Authorization");
        if (!token)
            return res.status(400).json({ message: "Invalid Authetication" });
        const decoded = (jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`));
        if (!decoded)
            return res.status(400).json({ message: "Invalid Authetication" });
        if (!decoded.USUARIOID)
            return res.status(401).json({ message: "Please login now!" });
        const params = new URLSearchParams();
        params.append("usuarioid", decoded.USUARIOID);
        const result = yield axios_1.default.post("http://vwebdelta/WebDataSap/Service1.asmx/EXISTE_USUARIO", params);
        if (typeof result.data === "string") {
            return res.json({ message: "No existe el usuario" });
        }
        const { USUARIOID, NOMBRE, NOEMPLEADO, direcciones, role } = decoded;
        req.user = {
            USUARIOID,
            NOMBRE,
            NOEMPLEADO,
            direcciones,
            role,
        };
        next();
    }
    catch (error) {
        console.log({ message: error.message });
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Please login now!" });
        }
        return res.status(500).json({ message: error.message });
    }
});
exports.default = auth;
