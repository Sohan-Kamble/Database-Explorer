// import { Request, Response } from 'express';
// import * as databaseService from '../services/database.service';

// export async function getTables(req: Request, res: Response) {
//   try {
//     const tables = await databaseService.getTables();
//     res.json(tables);
//   } catch (error) {
//     console.error('Failed to get tables:', error);
//     res.status(500).json({ error: 'Failed to fetch tables' });
//   }
// }

// export async function getTableData(req: Request, res: Response) {
//   try {
//     const { table } = req.params;
//     const filters = req.query;
//     const data = await databaseService.getTableData(table, filters);
//     res.json(data);
//   } catch (error) {
//     console.error('Failed to get table data:', error);
//     res.status(500).json({ error: 'Failed to fetch table data' });
//   }
// }


import { Request, Response } from 'express';
import * as databaseService from '../services/database.service';

export async function getTables(req: Request, res: Response) {
  try {
    const tables = await databaseService.getTables();
    res.json(tables);
  } catch (error) {
    console.error('Failed to get tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
}

export async function getTableData(req: Request, res: Response) {
  try {
    const { table } = req.params;

    // Safely transform `req.query` into `Record<string, string | number>`
    const filters: Record<string, string | number> = Object.fromEntries(
      Object.entries(req.query).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value[0] || '']; // Use the first element or empty string
        } else if (typeof value === 'string') {
          return [key, value];
        } else {
          return [key, '']; // Replace undefined or incompatible values with empty string
        }
      })
    ) as Record<string, string | number>; // Explicit type assertion

    const data = await databaseService.getTableData(table, filters);
    res.json(data);
  } catch (error) {
    console.error('Failed to get table data:', error);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
}
