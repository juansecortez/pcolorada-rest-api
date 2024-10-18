import sql, { ConnectionPool } from "mssql";

// Tipo para las configuraciones de la base de datos
interface DbSettings {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
}

//Configuración para SQL Server query de conexión
const dbSettings: DbSettings = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME || '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Conexión a la base de datos de VDBGAMA
export async function getconectionVDBGAMA(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error en la conexión a VDBGAMA:`, error.message);
      console.error(`Detalles del error:`, error.stack);
    }
    return false;
  }
}

//Configuración para SQL Server query de conexión
const dbSettings2: DbSettings = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB2_SERVER || '',
  database: process.env.DB2_NAME || '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Conexión a la base de datos VDBDELTA
export async function getconectionVDBDELTA(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings2);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error en la conexión a VDBDELTA:`, error.message);
      console.error(`Detalles del error:`, error.stack);
    }
    return false;
  }
}


const dbSettings3: DbSettings = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || '',
  database: process.env.DB3_NAME || '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function getconectionOrganigrama(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettings3);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error en la conexión a Organigrama:`, error.message);
      console.error(`Detalles del error:`, error.stack);
    }
    return false;
  }
}

//Configuración para SQL Server query de conexión local
const dbSettingsGratas: DbSettings = {
  user: process.env.DB_GRATASLOCAL_USER || '',
  password: process.env.DB_GRATASLOCAL_PASSWORD || '',
  server: process.env.DB_GRATASLOCAL_SERVER || '',
  database: process.env.DB_GRATASLOCAL_NAME || '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Conexión a la base de datos GratasLocal
export async function getconectionGratas(): Promise<ConnectionPool | false> {
  try {
    const pool = await sql.connect(dbSettingsGratas);
    return pool;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error en la conexión a GratasLocal:`, error.message);
      console.error(`Detalles del error:`, error.stack);
    }
    return false;
  }
}
