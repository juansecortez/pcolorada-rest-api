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
const database_1 = require("../config/database");
const createGrata_1 = __importDefault(require("../utils/createGrata"));
const getCurrentPeriod_1 = require("../utils/getCurrentPeriod");
const insertSalary_1 = require("../utils/insertSalary");
const sendEmail_1 = require("../utils/sendEmail");
const Validate_1 = require("../utils/Validate");
const validGrata_1 = require("../utils/validGrata");
const grataController = {
    createGrata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ message: "Invalid authentication." });
        if (req.user.role !== "Administrador")
            return res.status(401).json({
                message: "No cuentas con las credenciales para realizar esta acción",
            });
        try {
            const { presupuestoFinanzas, presupuestoMinas, presupuestoPelet, presupuestoRH, presupuestoGeneral, presupuestoBeneficio, presupuestoTec, presupuestoDirectores, anio, fechaInicio, fechaFin, dataExcel, } = req.body;
            console.log({
                presupuestoFinanzas,
                presupuestoMinas,
                presupuestoPelet,
                presupuestoRH,
                presupuestoGeneral,
                presupuestoBeneficio,
                presupuestoTec,
                presupuestoDirectores,
                anio,
                fechaInicio,
                fechaFin,
                dataExcel,
            });
            const errors = (0, Validate_1.validateGrata)(presupuestoFinanzas, presupuestoMinas, presupuestoPelet, presupuestoRH, presupuestoGeneral, presupuestoBeneficio, presupuestoTec, presupuestoDirectores, anio, fechaInicio, fechaFin, dataExcel);
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const valid = yield (0, validGrata_1.validExistGrata)(anio);
            if (valid.message === 1) {
                return res
                    .status(403)
                    .json({ message: `Ya existe un periodo con el año ${anio}` });
            }
            dataExcel.map((data) => {
                (0, insertSalary_1.insertSalary)(data, anio).catch((error) => {
                    throw new Error(error);
                });
            });
            let pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                throw new Error("No hay conexión");
            }
            const response = yield pool.request().query(`USE GRATA
      EXEC [dbo].[SumInsertados_Salarios] ${anio}`);
            const { recordsets } = response;
            console.log();
            pool.close();
            let message = [];
            message.push(recordsets[0][0].total);
            yield (0, createGrata_1.default)(anio, fechaFin, fechaInicio, presupuestoRH, presupuestoFinanzas, presupuestoMinas, presupuestoBeneficio, presupuestoPelet, presupuestoGeneral, presupuestoTec, presupuestoDirectores);
            let pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
        SELECT usuario_id from usuarios`);
            const workers = result.recordsets[0];
            workers.map((worker) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, sendEmail_1.sendEmail)(`${worker.usuario_id}@pcolorada.com`, `http://vwebgama:5002/login`, `Periodo ${anio}`, `Inicia el proceso de asignación de bono por desempeño del periodo ${anio}`).catch((error) => {
                    console.log({ message: error.message });
                    throw new Error("No se envio el correo");
                });
            }));
            pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result2 = yield pool1.query(`USE GRATA
        EXEC getGrata ${anio}
      `);
            const workersGrata = result2.recordsets[0];
            pool1.close();
            message.push("Periodo creado correctamente");
            return res.status(201).json({ message });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(400).json({ message: error.message });
        }
    }),
    validateExistGrata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { anio } = req.body;
            const result = yield (0, validGrata_1.validExistGrata)(anio);
            return res.json(result);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getGrata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // if (!req.user)
        //   return res.status(400).json({ message: "Invalid authentication." });
        try {
            const { year, idDirection } = req.query;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año debe de ser numerico");
            }
            if (!(0, Validate_1.validateNumber)(idDirection)) {
                errors.push("La dirección debe de ser numerica");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const valid = yield (0, validGrata_1.validExistGrata)(year);
            if (valid.message === 0) {
                return res
                    .status(403)
                    .json({ message: `El periodo no esta disponible ${year}` });
            }
            let pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const totalWorkersByEvaluation = yield pool.query(`USE GRATA
      EXEC [dbo].[workersTotEvaluated] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const totalWorkersByPotential = yield pool.query(`USE GRATA
      EXEC [dbo].[workersTotByPotential] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const totalWorkersByQualification = yield pool.query(`USE GRATA
      EXEC [dbo].[workersTotByCalf] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const budgetGrata = yield pool.query(`USE GRATA
      EXEC [dbo].[getPresupuestoGrata] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const actualBudgetGrata = yield pool.query(`USE GRATA
      EXEC [dbo].[getActualBudgetGrata] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const commentsGrata = yield pool.query(`USE GRATA
      SELECT p.comentarios FROM presupuestos p
      INNER JOIN periodos per on p.id_Periodo = per.id_Periodo
      where per.anio_periodo = ${year} and p.id_Direccion = ${idDirection}
      `);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const statusGrata = yield pool.query(`USE GRATA
      EXEC [dbo].[getStatusGrata] ${year}, ${idDirection}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const workersGrata = yield pool.query(`USE GRATA
      EXEC [dbo].[getWorkersByDirection] ${idDirection}, ${year}`);
            pool.close();
            pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const data = yield pool.query(`USE GRATA
      EXEC [dbo].[promedioMatriz] ${idDirection},${year}`);
            const result = data.recordsets;
            let averagePeriod = [];
            result[0].map((element) => {
                averagePeriod = [...averagePeriod, element.promedio];
            });
            pool.close();
            res.status(200).json({
                periodGrata: parseInt(year),
                statusGrata: statusGrata.recordsets[0][0].estatus,
                budgetGrata: budgetGrata.recordsets[0][0].presupuesto,
                commentsGrata: commentsGrata.recordsets[0][0].comentarios,
                actualBudgetGrata: actualBudgetGrata.recordsets[0][0].presupuesto_Final,
                totalWorkersByEvaluation: totalWorkersByEvaluation.recordsets[0],
                totalWorkersByPotential: totalWorkersByPotential.recordsets[0],
                totalWorkersByQualification: totalWorkersByQualification.recordsets[0],
                workersGrata: workersGrata.recordsets[0],
                averagePeriod: averagePeriod,
            });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    finishGrata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { direccion, comentarios, anio } = req.body;
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      EXEC [dbo].[finishGrata] '${comentarios}',${anio},${direccion}`);
            pool1.close();
            res.status(200).json({ message: result.recordsets[0][0].msg });
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getDirecciones: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { anio } = req.body;
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      select d.nombre_direccion,d.id from direccion d
      inner join presupuestos p on d.id = p.id_Direccion
      inner join periodos per on p.id_Periodo = per.id_Periodo 
      where per.anio_periodo = ${anio}`);
            pool1.close();
            res.status(200).json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getAnios: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      select DISTINCT(anio_periodo) from periodos`);
            pool1.close();
            res.status(200).json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getPeriods: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      select sum(pre.presupuesto)as presupuesto,p.anio_periodo,sum(pre.presupuesto_Final)as presupuesto_Real,p.estatus from periodos p
      inner join presupuestos pre on p.id_Periodo = pre.id_Periodo
      group by p.anio_periodo , p.estatus`);
            pool1.close();
            res.status(200).json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getYears: (req, res) => {
        try {
            let anios = [];
            let n = 0;
            let year = new Date();
            let newYear = year.getFullYear();
            let newyear = newYear - 3;
            while (n < 8) {
                n++;
                anios.push({ anio: newyear++ });
            }
            const anioss = [{ anio: 2020 }];
            res.json(anios);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },
    getStatusGrata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDireccion, periodo } = req.query;
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      select p.estatus from presupuestos pre
      inner join periodos p on pre.id_Periodo = p.id_Periodo
      where pre.id_Direccion = ${idDireccion} and p.anio_periodo = ${periodo}`);
            pool1.close();
            res.status(200).json(result.recordsets[0][0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getCurrentPeriod: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield (0, getCurrentPeriod_1.getCurrentPeriod)();
            res.status(200).json(data);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
};
exports.default = grataController;
