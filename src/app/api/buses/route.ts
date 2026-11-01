import { NextResponse } from 'next/server';
import { busStore } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from')?.trim().toLowerCase() || '';
  const to = searchParams.get('to')?.trim().toLowerCase() || '';
  const typeParam = searchParams.get('types') || '';

  let results = [...busStore];

  if (from) {
    results = results.filter(b => b.from.toLowerCase().includes(from));
  }
  if (to) {
    results = results.filter(b => b.to.toLowerCase().includes(to));
  }

  if (typeParam) {
    const selectedTypes = typeParam.split(',').map(t => t.trim()).filter(Boolean);
    if (selectedTypes.length > 0) {
      results = results.filter(b => selectedTypes.includes(b.type));
    }
  }

  return NextResponse.json({
    status: 'success',
    buses: results,
    total: results.length
  });
}

