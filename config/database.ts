import sql from "mssql";
//Configuración para SQL Server query de conexión
const dbSettings = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  server: `${process.env.DB_SERVER}`,
  database: `${process.env.DB_NAME}`,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
//Conexión a la base de datos de VDBGAMA
export async function getconectionVDBGAMA() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(`No hay conexion db`);
    return false;
  }
}
//Configuración para SQL Server query de conexión
const dbSettings2 = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  server: `${process.env.DB2_SERVER}`,
  database: `${process.env.DB2_NAME}`,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

//Conexión a la base de datos VDBDELTA
export async function getconectionVDBDELTA() {
  try {
    const pool = await sql.connect(dbSettings2);
    return pool;
  } catch (error) {
    console.error(`No hay conexion db`);
    return false;
  }
}
//Configuración para SQL Server query de conexión local
const dbSettingsGratas = {
  user: `${process.env.DB_GRATASLOCAL_USER}`,
  password: `${process.env.DB_GRATASLOCAL_PASSWORD}`,
  server: `${process.env.DB_GRATASLOCAL_SERVER}`,
  database: `${process.env.DB_GRATASLOCAL_NAME}`,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
//Conexión a la base de datos
export async function getconectionGratas() {
  try {
    const pool = await sql.connect(dbSettingsGratas);
    return pool;
  } catch (error) {
    console.error(`No hay conexion db`);
    console.log(error);
    return false;
  }
}
