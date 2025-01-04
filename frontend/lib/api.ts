const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getTables() {
  const response = await fetch(`${API_URL}/tables`);
  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }
  return response.json();
}

export async function getTableData(table: string, filters: Record<string, string> = {}) {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/tables/${table}/data?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch table data');
  }
  return response.json();
}