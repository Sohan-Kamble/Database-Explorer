// import { createDbConnection } from '../config/database';

// export async function getTables() {
//   const connection = await createDbConnection();
//   try {
//     const [rows] = await connection.execute('SHOW TABLES');
//     return rows;
//   } finally {
//     await connection.end();
//   }
// }

// export async function getTableData(tableName: string, filters: any = {}) {
//   const connection = await createDbConnection();
//   try {
//     const sanitizedTableName = connection.escapeId(tableName);
//     let query = `SELECT * FROM ${sanitizedTableName}`;
//     const filterValues = [];
    
//     const filterConditions = Object.entries(filters)
//       .filter(([key, value]) => key !== 'table' && value)
//       .map(([key, value]) => {
//         const sanitizedKey = connection.escapeId(key);
//         filterValues.push(`%${value}%`);
//         return `${sanitizedKey} LIKE ?`;
//       });
    
//     if (filterConditions.length > 0) {
//       query += ` WHERE ${filterConditions.join(' AND ')}`;
//     }
    
//     query += ' LIMIT 1000';
    
//     const [rows] = await connection.execute(query, filterValues);
//     return rows;
//   } finally {
//     await connection.end();
//   }
// }



import { createDbConnection } from '../config/database';

export async function getTables() {
  const connection = await createDbConnection();
  try {
    const [rows] = await connection.execute('SHOW TABLES');
    return rows;
  } finally {
    await connection.end();
  }
}

export async function getTableData(tableName: string, filters: Record<string, string | number> = {}) {
  const connection = await createDbConnection();
  try {
    const sanitizedTableName = connection.escapeId(tableName);
    let query = `SELECT * FROM ${sanitizedTableName}`;
    const filterValues: string[] = []; // Explicitly declare the type

    const filterConditions = Object.entries(filters)
      .filter(([key, value]) => key !== 'table' && value !== undefined && value !== null)
      .map(([key, value]) => {
        const sanitizedKey = connection.escapeId(key);
        filterValues.push(`%${value}%`); // Add the filter value to the array
        return `${sanitizedKey} LIKE ?`; // Return the condition
      });

    if (filterConditions.length > 0) {
      query += ` WHERE ${filterConditions.join(' AND ')}`;
    }

    query += ' LIMIT 1000';

    const [rows] = await connection.execute(query, filterValues);
    return rows;
  } finally {
    await connection.end();
  }
}
