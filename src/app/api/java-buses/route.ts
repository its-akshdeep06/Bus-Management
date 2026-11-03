import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'legacy', 'buses.json');
    const buses = JSON.parse(readFileSync(file, 'utf-8'));
    return NextResponse.json({ status: 'success', source: 'BusSystem.java', buses });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Run BusSystem.java first.' }, { status: 500 });
  }
}