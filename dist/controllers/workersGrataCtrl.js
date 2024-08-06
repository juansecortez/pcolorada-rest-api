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
const Validate_1 = require("../utils/Validate");
const validGrata_1 = require("../utils/validGrata");
const workersController = {
    insertBonoFinalWorker: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { codigo_Empleado, bono_Final, anio } = req.body;
            const errors = (0, Validate_1.validateInsertBonoFinal)(codigo_Empleado, bono_Final, anio);
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            let pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const worker = yield pool1.query(`USE GRATA
        SELECT * FROM 
        Trabajadores where codigo_Empleado=${codigo_Empleado} and anio = ${anio}`);
            if (Object.keys(worker.recordsets[0]).length === 0) {
                return res.status(404).json({
                    message: `No se encontro el empledo con el codigo: ${codigo_Empleado} en el año ${anio}`,
                });
            }
            pool1.close();
            pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            yield pool1.query(`USE GRATA
      UPDATE Trabajadores set bono_Final = ${bono_Final}, fecha_Actualizacion = CURRENT_TIMESTAMP
      where codigo_Empleado = ${codigo_Empleado} and anio = ${anio}`);
            const result = yield pool1.query(`USE GRATA
        SELECT * FROM 
        Trabajadores where codigo_Empleado=${codigo_Empleado} and anio = ${anio}`);
            pool1.close();
            return res.json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    updateWorkersBonoFinalAverage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDirection, year } = req.body;
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
                    .json({ message: `No existe una periodo con el año ${year}` });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalPromedio] ${idDirection}, ${year}`);
            pool1.close();
            return res.json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    updateWorkersBonoFinalMax: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDirection, year } = req.body;
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
                    .json({ message: `No existe una periodo con el año ${year}` });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalMaximo] ${idDirection}, ${year}`);
            pool1.close();
            return res.json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    updateWorkersBonoFinalMin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDirection, year } = req.body;
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
                    .json({ message: `No existe un periodo con el año ${year}` });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      EXEC [dbo].[updateBonoFinalMinimo] ${idDirection}, ${year}`);
            pool1.close();
            return res.json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getDirectionsByUserId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const directions = yield pool1.query(`USE GRATA EXEC [dbo].[getDirectionsByUserID] '${userId}' `);
            pool1.close();
            res.json(directions.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getWorkerHistory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { codWorker } = req.body;
            const errors = [];
            if (!(0, Validate_1.validateNumber)(codWorker)) {
                errors.push("El codigo de empleado debe ser numerico");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const workerHistory = yield pool1.query(`USE GRATA EXEC [dbo].[sp_obtenercalif_historial] ${codWorker} `);
            pool1.close();
            res.json(workerHistory.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getWorkersByDirection: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idDirection, year } = req.body;
            let errors = [];
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
                    .json({ message: `No existe un periodo con el año ${year}` });
            }
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
      SELECT * FROM Trabajadores WHERE anio = ${year} and id_direccion = ${idDirection}`);
            pool1.close();
            return res.json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
};
exports.default = workersController;
