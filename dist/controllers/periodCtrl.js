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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const sendEmail_1 = require("../utils/sendEmail");
const Validate_1 = require("../utils/Validate");
const validGrata_1 = require("../utils/validGrata");
const periodController = {
    getPeriod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year } = req.query;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año debe de ser numerico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const valid = yield (0, validGrata_1.validExistGrata)(year);
            if (valid.message !== 1) {
                return res
                    .status(403)
                    .json({ message: `No existe el periodo ${year}` });
            }
            let pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const totalWorkersByPotential = yield pool.query(`USE GRATA
    EXEC [dbo].[workersTotByPotentialPeriod] ${year}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const totalWorkersByQualification = yield pool.query(`USE GRATA
      EXEC [dbo].[workersTotByCalfPeriod] ${year}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const workersByPeriod = yield pool.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${year}`);
            const result = yield pool.query(`USE GRATA
      EXEC [dbo].[getPresupuestoPeriodo] ${year}`);
            const { recordsets } = result;
            const { presupuesto, presupuesto_Real } = recordsets[0][0];
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const data = yield pool.query(`USE GRATA
      EXEC [dbo].[promedioMatriz] ${0},${year}`);
            const resul = data.recordsets;
            let averagePeriod = [];
            resul[0].map((element) => {
                averagePeriod = [...averagePeriod, element.promedio];
            });
            pool.close();
            return res.status(200).json({
                periodPeriod: parseInt(year),
                budgetPeriod: presupuesto,
                actualBudgetPeriod: presupuesto_Real,
                totalWorkersByPotential: totalWorkersByPotential.recordsets[0],
                totalWorkersByQualification: totalWorkersByQualification.recordsets[0],
                averagePeriod: averagePeriod,
            });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    authPeriod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year, estatus } = req.body;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año debe de ser numerico");
            }
            if (!(0, Validate_1.validateNumber)(estatus)) {
                errors.push("El año debe de ser numerico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const valid = yield (0, validGrata_1.validExistGrata)(year);
            if (valid.message !== 1) {
                return res
                    .status(403)
                    .json({ message: `No existe el periodo ${year}` });
            }
            let pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            if (estatus === 0) {
                return res.status(403).json({ message: "Pendiente de finalizar" });
            }
            else if (estatus === 1) {
                pool = yield (0, database_1.getconectionVDBGAMA)();
                if (pool === false) {
                    return res.status(400).json({ message: "No hay servicio" });
                }
                const resul = yield pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 1`);
                const data = resul.recordsets[0];
                const user = data[0];
                yield (0, sendEmail_1.sendEmail)(`${user.usuario_id}@pcolorada.com`, `http://vwebgama:5002/login`, `Autorizar periodo de asignación ${year}`, `Autorizar periodo de asignación ${year}`).catch((error) => {
                    console.log({ message: error.message });
                    throw new Error("No se envio el correo");
                });
                pool.close();
                return res.status(200).json({
                    message: "Periodo enviado para autorización dirección de recursos humanos",
                });
            }
            else if (estatus === 2) {
                pool = yield (0, database_1.getconectionVDBGAMA)();
                if (pool === false) {
                    return res.status(400).json({ message: "No hay servicio" });
                }
                const result = yield pool.query(`USE GRATA
        update periodos set estatus = 2 where anio_periodo = ${year}
        `);
                pool.close();
                pool = yield (0, database_1.getconectionVDBGAMA)();
                if (pool === false) {
                    return res.status(400).json({ message: "No hay servicio" });
                }
                const resul = yield pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 6`);
                const data = resul.recordsets[0];
                const user = data[0];
                yield (0, sendEmail_1.sendEmail)(`${user.usuario_id}@pcolorada.com`, `http://vwebgama:5002/login`, `Autorizar periodo de asignación ${year}`, `Autorizar periodo de asignación ${year}`).catch((error) => {
                    console.log({ message: error.message });
                    throw new Error("No se envio el correo");
                });
                pool.close();
                return res
                    .status(200)
                    .json({ message: "Periodo enviado para autorización dirección general" });
            }
            else if (estatus === 3) {
                pool = yield (0, database_1.getconectionVDBGAMA)();
                if (pool === false) {
                    return res.status(400).json({ message: "No hay servicio" });
                }
                yield pool.query(`USE GRATA
        update periodos set estatus = 3 where anio_periodo = ${year}
        `);
                pool.close();
                pool = yield (0, database_1.getconectionVDBGAMA)();
                if (pool === false) {
                    return res.status(400).json({ message: "No hay servicio" });
                }
                const resul = yield pool.query(`USE GRATA
        select * from usuarios u
        inner join usuarios_direcciones ud on u.usuario_id = ud.id_usuario
        where ud.id_direccion = 1`);
                const data = resul.recordsets[0];
                const user = data[0];
                yield (0, sendEmail_1.sendEmail)(`${user.usuario_id}@pcolorada.com`, `http://vwebgama:5002/login`, `Autorizar periodo de asignación ${year}`, `El proceso de bono del ${year} ha sido autorizado por dirección general y dirección de recursos humanos`).catch((error) => {
                    console.log({ message: error.message });
                    throw new Error("No se envio el correo");
                });
                pool.close();
                return res.status(200).json({ message: "Periodo autorizado" });
            }
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getAniosPeriodByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { estatus } = req.query;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(estatus)) {
                errors.push("El estatus de ser numerico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      select anio_periodo from periodos where estatus = ${estatus}`);
            pool1.close();
            return res.status(200).json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    averageMatrix: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDirection, year } = req.query;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(idDirection)) {
                errors.push("La dirección de ser numérica");
            }
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año de ser numérico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const data = yield pool1.query(`USE GRATA
      EXEC [dbo].[promedioMatriz] ${idDirection},${year}`);
            const result = data.recordsets;
            let averagePeriod = [];
            result[0].map((element) => {
                averagePeriod = [...averagePeriod, element.promedio];
            });
            pool1.close();
            return res.status(200).json(averagePeriod);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    sendEmailPeriod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year } = req.body;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año de ser numérico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            yield pool1.query(`USE GRATA EXEC [dbo].[EnvioCorreoBono] ${year}`);
            pool1.close();
            return res
                .status(200)
                .json({ message: "Correos enviados a todos los trabajadores" });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getWorkersByPeriod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year } = req.body;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año de ser numérico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA EXEC [dbo].[getWorkersByPeriod] ${year}`);
            const workersData = result.recordsets;
            pool1.close();
            return res.status(200).json(workersData);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
};
exports.default = periodController;
