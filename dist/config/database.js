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
exports.getconectionVDBGAMA = getconectionVDBGAMA;
exports.getconectionVDBDELTA = getconectionVDBDELTA;
exports.getconectionOrganigrama = getconectionOrganigrama;
exports.getconectionGratas = getconectionGratas;
const mssql_1 = __importDefault(require("mssql"));
// Configuración general del pool de conexiones para optimizar conexiones simultáneas
const generalPoolSettings = {
    max: 50, // Máximo de conexiones en el pool
    min: 10, // Mínimo de conexiones en el pool
    idleTimeoutMillis: 60000, // Tiempo antes de liberar una conexión inactiva
};
// Configuración para la base de datos VDBGAMA
const dbSettings = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: generalPoolSettings,
};
// Conexión a la base de datos VDBGAMA
function getconectionVDBGAMA() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield mssql_1.default.connect(dbSettings);
            return pool;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error en la conexión a VDBGAMA:", error.message);
                console.error("Detalles del error:", error.stack);
            }
            return false;
        }
    });
}
// Configuración para la base de datos VDBDELTA
const dbSettings2 = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB2_SERVER || '',
    database: process.env.DB2_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: generalPoolSettings,
};
// Conexión a la base de datos VDBDELTA
function getconectionVDBDELTA() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield mssql_1.default.connect(dbSettings2);
            return pool;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error en la conexión a VDBDELTA:", error.message);
                console.error("Detalles del error:", error.stack);
            }
            return false;
        }
    });
}
// Configuración para la base de datos Organigrama
const dbSettings3 = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB3_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: generalPoolSettings,
};
// Conexión a la base de datos Organigrama
function getconectionOrganigrama() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield mssql_1.default.connect(dbSettings3);
            return pool;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error en la conexión a Organigrama:", error.message);
                console.error("Detalles del error:", error.stack);
            }
            return false;
        }
    });
}
// Configuración para la base de datos GratasLocal
const dbSettingsGratas = {
    user: process.env.DB_GRATASLOCAL_USER || '',
    password: process.env.DB_GRATASLOCAL_PASSWORD || '',
    server: process.env.DB_GRATASLOCAL_SERVER || '',
    database: process.env.DB_GRATASLOCAL_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: generalPoolSettings,
};
// Conexión a la base de datos GratasLocal
function getconectionGratas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield mssql_1.default.connect(dbSettingsGratas);
            return pool;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error en la conexión a GratasLocal:", error.message);
                console.error("Detalles del error:", error.stack);
            }
            return false;
        }
    });
}
