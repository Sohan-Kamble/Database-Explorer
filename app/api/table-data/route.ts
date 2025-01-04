export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getTableData } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    
    if (!table) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
    }

    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'table' && value) {
        filters[key] = value;
      }
    });

    const data = await getTableData(table, filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching table data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch table data' },
      { status: 500 }
    );
  }
}