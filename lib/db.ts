// import mysql from 'mysql2/promise';

// const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

// function checkEnvVariables() {
//   const missingVars = requiredEnvVars.filter(
//     (varName) => !process.env[varName]
//   );
  
//   if (missingVars.length > 0) {
//     throw new Error(
//       `Missing required environment variables: ${missingVars.join(', ')}. ` +
//       'Please create a .env file with the required database credentials.'
//     );
//   }
// }

// export async function getConnection() {
//   try {
//     checkEnvVariables();
    
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       // Add connection timeout and retry options
//       connectTimeout: 10000,
//       waitForConnections: true,
//       connectionLimit: 10,
//       maxIdle: 10,
//       idleTimeout: 60000,
//       queueLimit: 0,
//     });
    
//     return connection;
//   } catch (error: any) {
//     if (error.code === 'ECONNREFUSED') {
//       throw new Error(
//         'Could not connect to the database. Please check if:\n' +
//         '1. The database server is running\n' +
//         '2. The database credentials in .env are correct\n' +
//         '3. The database server is accessible from this location'
//       );
//     }
//     throw error;
//   }
// }

// export async function getTables() {
//   try {
//     const connection = await getConnection();
//     try {
//       const [rows] = await connection.execute('SHOW TABLES');
//       return rows;
//     } finally {
//       await connection.end();
//     }
//   } catch (error) {
//     console.error('Failed to fetch tables:', error);
//     return [];
//   }
// }

// export async function getTableData(tableName: string, filters: any = {}) {
//   const connection = await getConnection();
//   try {
//     // Sanitize table name to prevent SQL injection
//     const sanitizedTableName = connection.escapeId(tableName);
    
//     let query = `SELECT * FROM ${sanitizedTableName}`;
//     const filterValues = [];
    
//     const filterConditions = Object.entries(filters)
//       .filter(([_, value]) => value)
//       .map(([key, value]) => {
//         // Sanitize column names
//         const sanitizedKey = connection.escapeId(key);
//         filterValues.push(`%${value}%`);
//         return `${sanitizedKey} LIKE ?`;
//       });
    
//     if (filterConditions.length > 0) {
//       query += ` WHERE ${filterConditions.join(' AND ')}`;
//     }
    
//     // Add a reasonable LIMIT to prevent loading too much data
//     query += ' LIMIT 1000';
    
//     const [rows] = await connection.execute(query, filterValues);
//     return rows;
//   } finally {
//     await connection.end();
//   }
// }



import mysql from 'mysql2/promise';

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

function checkEnvVariables() {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        'Please create a .env file with the required database credentials.'
    );
  }
}

export async function getConnection() {
  try {
    checkEnvVariables();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000, // Connection timeout
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
    });

    return connection;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'Could not connect to the database. Please check if:\n' +
          '1. The database server is running\n' +
          '2. The database credentials in .env are correct\n' +
          '3. The database server is accessible from this location'
      );
    }
    throw error;
  }
}

export async function getTables() {
  try {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute('SHOW TABLES');
      return rows;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return [];
  }
}

export async function getTableData(
  tableName: string,
  filters: Record<string, any> = {}
) {
  const connection = await getConnection();
  try {
    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = connection.escapeId(tableName);

    let query = `SELECT * FROM ${sanitizedTableName}`;
    const filterValues: string[] = []; // Explicitly define the type as an array of strings

    const filterConditions = Object.entries(filters)
      .filter(([_, value]) => value) // Skip empty or null values
      .map(([key, value]) => {
        // Sanitize column names and values
        const sanitizedKey = connection.escapeId(key);
        filterValues.push(`%${value}%`); // Add the filter value with wildcards
        return `${sanitizedKey} LIKE ?`;
      });

    if (filterConditions.length > 0) {
      query += ` WHERE ${filterConditions.join(' AND ')}`;
    }

    // Add a LIMIT to avoid loading too much data
    query += ' LIMIT 1000';

    const [rows] = await connection.execute(query, filterValues);
    return rows;
  } finally {
    await connection.end();
  }
}
