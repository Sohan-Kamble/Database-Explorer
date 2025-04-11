import pyodbc
import json
from datetime import datetime

mssql_config = {
    "driver": "{SQL Server}",
    "server": "PROD-RIG-DATA-P\\SQLEXPRESS",
    "database": "Reporting_Database",
    "trusted_connection": "yes"
}

conn_str = (
    f"DRIVER={mssql_config['driver']};"
    f"SERVER={mssql_config['server']};"
    f"DATABASE={mssql_config['database']};"
    f"Trusted_Connection={mssql_config['trusted_connection']};"
)

try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.execute("SELECT TOP 1000 * FROM TestResult")

    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    def serialize_row(row):
        return {columns[i]: (value.isoformat() if isinstance(value, datetime) else value) for i, value in enumerate(row)}

    data = [serialize_row(row) for row in rows]

    print(json.dumps(data, ensure_ascii=False))  # ✅ PRINT JSON ONLY

except Exception as e:
    print(json.dumps({"error": str(e)}))  # ✅ PRINT JSON ERROR

finally:
    conn.close()
