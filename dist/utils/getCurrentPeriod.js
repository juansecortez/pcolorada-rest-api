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
exports.getCurrentPeriod = void 0;
const database_1 = require("../config/database");
const getCurrentPeriod = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool1 = yield (0, database_1.getconectionVDBGAMA)();
    if (pool1 === false) {
        throw new Error("No hay conexión");
    }
    const result = yield pool1.query(`USE GRATA
  EXEC [dbo].[obtenerPeriodoVigente]`);
    pool1.close();
    const { recordsets } = result;
    return recordsets[0];
});
exports.getCurrentPeriod = getCurrentPeriod;
