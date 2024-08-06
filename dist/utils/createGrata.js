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
const newGrata = (anio, fecha_Fin, fecha_Inicio, presupuestoRH, presupuestoFinanzas, presupuestoMinas, presupuestoBeneficio, presupuestoPelet, presupuestoGeneral, presupuestoTec, presupuestoDirectores) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, database_1.getconectionVDBGAMA)();
    if (pool === false) {
        throw new Error("No hay conexión");
    }
    const respondG = yield pool.request().query(`USE GRATA
        EXEC [dbo].[createnewGrata_v1] '${anio}',
        '${fecha_Inicio}','${fecha_Fin}','${presupuestoRH}','${presupuestoFinanzas}',
        '${presupuestoMinas}','${presupuestoBeneficio}','${presupuestoPelet}','${presupuestoGeneral}',
        '${presupuestoTec}','${presupuestoDirectores}'`);
    const { recordsets: respond2 } = respondG;
    console.log(respondG.recordset);
    if (Object.keys(respond2).length === 0) {
        pool.close();
        throw new Error("No se creo la grata");
    }
    pool.close();
});
exports.default = newGrata;
