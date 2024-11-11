import sql, { ConnectionPool, config as SQLConfig } from "mssql";

// Tipo para las configuraciones de la base de datos
interface DbSettings extends SQLConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

// Configuración general del pool de conexiones para optimizar conexiones simultáneas
const generalPoolSettings = {
  max: 50, // Máximo de conexiones en el pool
  min: 10,  // Mínimo de conexiones en el pool
  idleTimeoutMillis: 60000, // Tiempo antes de liberar una conexión inactiva
};

// Configuración para la base de datos VDBGAMA
const dbSettings: DbSettings = {
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
export async function getconectionVDBGAMA(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en la conexión a VDBGAMA:", error.message);
      console.error("Detalles del error:", error.stack);
    }
    return false;
  }
}

// Configuración para la base de datos VDBDELTA
const dbSettings2: DbSettings = {
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
export async function getconectionVDBDELTA(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings2);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en la conexión a VDBDELTA:", error.message);
      console.error("Detalles del error:", error.stack);
    }
    return false;
  }
}

// Configuración para la base de datos Organigrama
const dbSettings3: DbSettings = {
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
export async function getconectionOrganigrama(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings3);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en la conexión a Organigrama:", error.message);
      console.error("Detalles del error:", error.stack);
    }
    return false;
  }
}

// Configuración para la base de datos GratasLocal
const dbSettingsGratas: DbSettings = {
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
export async function getconectionGratas(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettingsGratas);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en la conexión a GratasLocal:", error.message);
      console.error("Detalles del error:", error.stack);
    }
    return false;
  }
}
