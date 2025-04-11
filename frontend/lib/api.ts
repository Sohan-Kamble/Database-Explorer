// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export async function getTables() {
//   const response = await fetch(`${API_URL}/tables`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch tables');
//   }
//   return response.json();
// }

// export async function getTableData(table: string, filters: Record<string, string> = {}) {
//   const queryParams = new URLSearchParams(filters);
//   const response = await fetch(`${API_URL}/tables/${table}/data?${queryParams}`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch table data');
//   }
//   return response.json();
// }


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch available databases (if needed)
export async function getAvailableDatabases() {
  const response = await fetch(`${API_URL}/databases`);
  if (!response.ok) {
    throw new Error('Failed to fetch available databases');
  }
  return response.json();
}

// Switch the active database
export async function switchDatabase(databaseKey: string) {
  const response = await fetch(`${API_URL}/switch-database`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ databaseKey }),
  });

  if (!response.ok) {
    throw new Error('Failed to switch database');
  }

  return response.json();
}

// Fetch tables from the currently selected database
export async function getTables() {
  const response = await fetch(`${API_URL}/tables`);
  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }
  return response.json();
}

// Fetch data from a specific table with optional filters
export async function getTableData(table: string, filters: Record<string, string> = {}) {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/tables/${table}/data?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch table data');
  }
  return response.json();
}
