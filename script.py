import pandas as pd
from sqlalchemy import create_engine

# Detalles de la conexión
server = '192.168.100.60'
database = 'ArensoOrganigrama'
username = 'tinformacion'
password = 'Timeinlondon$'

# Cadena de conexión
conn_str = f"mssql+pyodbc://{username}:{password}@{server}/{database}?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(conn_str)

# Consulta SQL
query = """
SELECT 
    a.Nombre,
    a.UsuarioId,
    O.UNOId,
    O.PUEId,
    O.UsuarioIdJefe,
    O.UNOIdJefe,
    O.PUEIdJefe,
    O.MFechaHora,
    P.Descripcion AS Puesto,  
    P.TGrupo,
    P.Primario
FROM 
    dbo.Colaborador AS a
INNER JOIN 
    dbo.Organigrama AS O ON a.UsuarioId = O.UsuarioId
INNER JOIN 
    dbo.Puesto AS P ON O.PUEId = P.PUEId
WHERE 
    P.TGrupo IN (2, 3, 4)
"""

# Leer los datos a un DataFrame de pandas
df = pd.read_sql(query, engine)

# Exportar los datos a un archivo CSV
csv_filename = 'Download.csv'
df.to_csv(csv_filename, index=False)

print(f"Datos exportados exitosamente a {csv_filename}")
