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
const createSucesion_1 = __importDefault(require("../utils/createSucesion"));
const getCurrentPeriod_1 = require("../utils/getCurrentPeriod");
const insertSalary_1 = require("../utils/insertSalary");
const sendEmail_1 = require("../utils/sendEmail");
const Validate_1 = require("../utils/Validate");
const validGrata_1 = require("../utils/validGrata");
const validSucesion_1 = require("../utils/validSucesion");
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
    createSucesion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ message: "Invalid authentication." });
        if (req.user.role !== "AdminTalentReview")
            return res.status(401).json({
                message: "No cuentas con las credenciales para realizar esta acción",
            });
        try {
            const { anio, fechaInicio, fechaFin, } = req.body;
            const valid = yield (0, validSucesion_1.validExistSucesion)(anio);
            if (valid.message === 1) {
                return res
                    .status(403)
                    .json({ message: `Ya existe un periodo con el año ${anio}` });
            }
            let pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                throw new Error("No hay conexión");
            }
            let message = [];
            yield (0, createSucesion_1.default)(anio, fechaFin, fechaInicio);
            let pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`USE GRATA
        SELECT usuario_id from usuarios`);
            const workers = result.recordsets[0];
            workers.map((worker) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, sendEmail_1.sendEmail)(`se.desarrolladormina@pcolorada.com`, `http://vwebgama:5002/login`, `Periodo ${anio}`, `Inicia el proceso de asignación de bono por desempeño del periodo ${anio}`).catch((error) => {
                    console.log({ message: error.message });
                    throw new Error("No se envio el correo");
                });
            }));
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
    getSucesion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year, idDirection } = req.query;
            const errors = [];
            // Validación de los parámetros recibidos
            if (!(0, Validate_1.validateNumber)(year)) {
                errors.push("El año debe de ser numérico");
            }
            if (!(0, Validate_1.validateNumber)(idDirection)) {
                errors.push("La dirección debe de ser numérica");
            }
            if (errors.length > 0) {
                return res.status(400).json({ message: errors });
            }
            // Verificación de la existencia del período
            const valid = yield (0, validSucesion_1.validExistSucesion)(year);
            if (valid.message === 0) {
                return res
                    .status(403)
                    .json({ message: `El periodo no está disponible para el año ${year}` });
            }
            // Conexión a la base de datos y obtención de los trabajadores
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const workersGrata = yield pool.query(`USE GRATA
      EXEC [dbo].[getWorkersByDirectionSucesion] ${idDirection}, ${year}`);
            pool.close();
            // Respuesta con solo los datos de los trabajadores
            res.status(200).json({
                workersGrata: workersGrata.recordsets[0],
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
            const result = yield pool1.query(`
        USE GRATA;
        SELECT DISTINCT anio_periodo 
        FROM periodos 
        WHERE proceso = 'Bono';
      `);
            pool1.close();
            res.status(200).json(result.recordsets[0]);
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    getAniosSucesion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pool1 = yield (0, database_1.getconectionVDBGAMA)();
            if (pool1 === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            const result = yield pool1.query(`
        USE GRATA;
        SELECT DISTINCT anio_periodo 
        FROM periodos 
        WHERE proceso = 'Sucesion';
      `);
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
    updatePotencial: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, potencial } = req.body;
            if (!id || !potencial) {
                return res.status(400).json({ message: "ID y potencial son requeridos." });
            }
            // Conexión a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(400).json({ message: "No hay servicio" });
            }
            // Actualización del potencial en la tabla Trabajadores_sucesion
            const query = `
        USE GRATA;
        UPDATE Trabajadores_sucesion 
        SET potencial = @potencial 
        WHERE id = @id;
      `;
            const result = yield pool.request()
                .input('id', id)
                .input('potencial', potencial)
                .query(query);
            pool.close();
            if (result.rowsAffected[0] > 0) {
                return res.status(200).json({ message: "Potencial actualizado correctamente." });
            }
            else {
                return res.status(404).json({ message: "Trabajador no encontrado." });
            }
        }
        catch (error) {
            console.log({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }),
    finalizeWorkers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { anio, direccion } = req.body;
            if (!anio || !direccion) {
                return res.status(400).json({ message: "Parámetros inválidos." });
            }
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            const result = yield pool.request()
                .input('anio', anio)
                .input('direccion', direccion)
                .query(`
          UPDATE Trabajadores_sucesion
          SET finalizado = 1
          WHERE anio = @anio AND id_direccion = @direccion
        `);
            pool.close();
            return res.status(200).json({ message: "Trabajadores finalizados correctamente." });
        }
        catch (error) {
            console.error("Error finalizando trabajadores:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    createSucesiones: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nombre, edad, antiguedad, puesto_actual, formacion, sucesivo_id, orden, anio, opcion, codigo_Empleado } = req.body;
            // Validar que se recibieron todos los datos necesarios
            if (!nombre || !edad || !antiguedad || !puesto_actual || !anio || !orden) {
                return res.status(400).json({ message: "Parámetros inválidos." });
            }
            // Conectar a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Realizar la inserción en la tabla sucesion
            const result = yield pool.request()
                .input('nombre', nombre)
                .input('edad', edad)
                .input('antiguedad', antiguedad)
                .input('puesto_actual', puesto_actual)
                .input('formacion', formacion || null) // Se puede omitir formación si es null
                .input('fecha_registro', new Date()) // Insertar la fecha actual
                .input('sucesivo_id', sucesivo_id || null) // Se puede omitir sucesivo_id si es null
                .input('orden', orden)
                .input('anio', anio)
                .input('opcion', opcion)
                .input('codigo_Empleado', codigo_Empleado)
                .query(`
          INSERT INTO sucesion (Nombre, Edad, Antigüedad, Puesto_actual, Formación, fecha_registro, sucesivo_id, orden, anio, Opcion, codigo_Empleado)
          VALUES (@nombre, @edad, @antiguedad, @puesto_actual, @formacion, @fecha_registro, @sucesivo_id, @orden, @anio, @opcion, @codigo_Empleado)
        `);
            pool.close();
            return res.status(201).json({ message: "Registro de sucesión creado correctamente." });
        }
        catch (error) {
            console.error("Error creando registro de sucesión:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    buscarColaboradorPorNombre: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nombre } = req.body;
            // Validar que se recibió el nombre
            if (!nombre) {
                return res.status(400).json({ message: "Parámetro 'nombre' es requerido." });
            }
            // Conectar a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Realizar la búsqueda en la vista vw_ColaboradoresDetallada
            const result = yield pool.request()
                .input('nombre', `%${nombre}%`)
                .query(`
SELECT TOP (40) 
  [codigo_Empleado],
  [Nombre],
  -- Calcular la Edad basada en la Fecha de Nacimiento
  DATEDIFF(YEAR, [FechaNacimiento], GETDATE()) AS Edad,
  -- Calcular la Antigüedad basada en la Fecha de Ingreso
  DATEDIFF(YEAR, [FechaIngreso], GETDATE()) AS Antiguedad,
  [Formacion],
  [Puesto] AS Puesto_actual,  -- Renombrar Puesto a Puesto_actual
  [id_direccion]
FROM [grata].[dbo].[people_by_sucesion_potencial]
WHERE [Nombre] LIKE '%' + @nombre + '%';


        `);
            pool.close();
            // Verificar si se encontraron resultados
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: "Colaborador no encontrado." });
            }
            return res.status(200).json(result.recordset);
        }
        catch (error) {
            console.error("Error buscando colaborador por nombre:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    buscarColaboradorPorCodigoEmpleado: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { codigo_Empleado, anio } = req.body;
            // Validar que se recibieron el código de empleado y el año
            if (!codigo_Empleado || !anio) {
                return res.status(400).json({ message: "Parámetros 'codigo_Empleado' y 'anio' son requeridos." });
            }
            // Conectar a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Realizar la búsqueda en la vista vw_ColaboradoresDetallada considerando el año
            const result = yield pool.request()
                .input('codigo_Empleado', codigo_Empleado)
                .input('anio', anio)
                .query(`
          SELECT 
            [id],
            [Nombre],
            [Edad],
            [Antigüedad],
            [Puesto_actual],
            [Formación],
            [fecha_registro],
            [sucesivo_id],
            [orden],
            [anio],
            [Opcion],
            [codigo_Empleado] as codWorker
          FROM 
            [grata].[dbo].[sucesion]
          WHERE 
            sucesivo_id = @codigo_Empleado AND anio = @anio
          ORDER BY 
            CASE 
              WHEN Opcion = 'Emergente' THEN 1 
              WHEN Opcion = 'Reemplazo HOY' THEN 2 
              WHEN Opcion = 'Mediano Plazo (3-5 años)' THEN 3 
              ELSE 4 -- Por si hay otras opciones que no se especificaron
            END,
            [orden] ASC,
            [fecha_registro] DESC;
        `);
            pool.close();
            // Verificar si se encontraron resultados
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: "Colaborador no encontrado para el año especificado." });
            }
            return res.status(200).json(result.recordset);
        }
        catch (error) {
            console.error("Error buscando colaborador por código de empleado:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    eliminarRegistroPorId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            // Validar que se recibió el id
            if (!id) {
                return res.status(400).json({ message: "Parámetro 'id' es requerido." });
            }
            // Conectar a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Eliminar el registro
            const result = yield pool.request()
                .input('id', id)
                .query(`
          DELETE FROM [grata].[dbo].[sucesion]
          WHERE id = @id
        `);
            pool.close();
            // Verificar si se eliminó algún registro
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ message: "Registro no encontrado o ya eliminado." });
            }
            return res.status(200).json({ message: "Registro eliminado correctamente." });
        }
        catch (error) {
            console.error("Error eliminando registro por id:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    modificarRegistroPorId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, nombre, edad, antiguedad, puesto_actual, formacion, sucesivo_id, orden, anio, opcion } = req.body;
            // Validar que se recibió el id y al menos un campo a actualizar
            if (!id) {
                return res.status(400).json({ message: "Parámetro 'id' es requerido." });
            }
            // Conectar a la base de datos
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Actualizar el registro
            const result = yield pool.request()
                .input('id', id)
                .input('nombre', nombre)
                .input('edad', edad)
                .input('antiguedad', antiguedad)
                .input('puesto_actual', puesto_actual)
                .input('formacion', formacion)
                .input('sucesivo_id', sucesivo_id)
                .input('orden', orden)
                .input('anio', anio)
                .input('opcion', opcion)
                .query(`
          UPDATE [grata].[dbo].[sucesion]
          SET 
            Nombre = @nombre,
            Edad = @edad,
            Antigüedad = @antiguedad,
            [Puesto_actual] = @puesto_actual,
            Formación = @formacion,
            sucesivo_id = @sucesivo_id,
            orden = @orden,
            anio = @anio,
            Opcion = @opcion
          WHERE id = @id
        `);
            pool.close();
            // Verificar si se actualizó algún registro
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ message: "Registro no encontrado o no se pudo actualizar." });
            }
            return res.status(200).json({ message: "Registro actualizado correctamente." });
        }
        catch (error) {
            console.error("Error modificando registro por id:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    buscarEstadoSucesionPorCodigoEmplead: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { codigo_Empleado, anio } = req.body;
            // Validar que se recibieron el código de empleado y el año
            if (!codigo_Empleado || !anio) {
                return res.status(400).json({ message: "Parámetros 'codigo_Empleado' y 'anio' son requeridos." });
            }
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (pool === false) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            const result = yield pool.request()
                .input('sucesivo_id', codigo_Empleado)
                .input('anio', anio)
                .query(`
          SELECT 
            SucesivoID,
            ColorCode AS Color,
            Emergente,
            ReemplazoInmediato,
            MedianoPlazo,
            Reemplazos
          FROM dbo.GetSuccessionStatus(@sucesivo_id, @anio);
        `);
            pool.close();
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: "Colaborador no encontrado." });
            }
            return res.status(200).json(result.recordset[0]);
        }
        catch (error) {
            console.error("Error buscando estado de sucesión por código de empleado:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    verificarRegistrosAnioAnterior: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { anio } = req.body;
            if (!anio) {
                return res.status(400).json({ message: "El parámetro 'anio' es requerido." });
            }
            const anioAnterior = Number(anio) - 1;
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (!pool) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            const result = yield pool.request()
                .input('anio', anioAnterior)
                .query(`
          SELECT COUNT(*) as registroCount
          FROM [grata].[dbo].[sucesion]
          WHERE anio = @anio;
        `);
            const registroCount = result.recordset[0].registroCount;
            pool.close();
            return res.status(200).json({ exists: registroCount >= 10 });
        }
        catch (error) {
            console.error("Error verificando registros del año anterior:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
    clonarSucesionAnioAnterior: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { anio } = req.body;
            if (!anio) {
                return res.status(400).json({ message: "El parámetro 'anio' es requerido." });
            }
            const anioAnterior = Number(anio) - 1;
            const pool = yield (0, database_1.getconectionVDBGAMA)();
            if (!pool) {
                return res.status(500).json({ message: "No hay conexión con la base de datos." });
            }
            // Insertar los registros del año anterior con el año actualizado al año seleccionado
            yield pool.request()
                .input('anioAnterior', anioAnterior)
                .input('anioActual', anio)
                .query(`
          INSERT INTO [grata].[dbo].[sucesion] (
            Nombre, Edad, Antigüedad, Puesto_actual, Formación, fecha_registro,
            sucesivo_id, orden, anio, Opcion, codigo_Empleado
          )
          SELECT 
            Nombre, Edad, Antigüedad, Puesto_actual, Formación, GETDATE() AS fecha_registro,
            sucesivo_id, orden, @anioActual AS anio, Opcion, codigo_Empleado
          FROM 
            [grata].[dbo].[sucesion]
          WHERE 
            anio = @anioAnterior;
        `);
            pool.close();
            return res.status(200).json({ message: "Sucesiones clonadas correctamente al año actual." });
        }
        catch (error) {
            console.error("Error clonando sucesiones:", error);
            return res.status(500).json({ message: error.message });
        }
    }),
};
exports.default = grataController;
