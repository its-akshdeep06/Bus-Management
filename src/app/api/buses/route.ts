import { NextResponse } from 'next/server';
import { busStore } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from')?.trim().toLowerCase() || '';
  const to = searchParams.get('to')?.trim().toLowerCase() || '';
  const date = searchParams.get('date') || '';
  const typeParam = searchParams.get('types') || '';
  const sortBy = searchParams.get('sortBy') || 'featured';
  const amenityParam = searchParams.get('amenities') || '';
  const maxPriceParam = searchParams.get('maxPrice');

  let results = [...busStore];

  if (from) {
    results = results.filter((b) => b.from.toLowerCase().includes(from));
  }
  if (to) {
    results = results.filter((b) => b.to.toLowerCase().includes(to));
  }

  if (typeParam) {
    const selectedTypes = typeParam.split(',').map((t) => t.trim()).filter(Boolean);
    if (selectedTypes.length > 0) {
      results = results.filter((b) => selectedTypes.includes(b.type));
    }
  }

  if (amenityParam) {
    const selectedAmenities = amenityParam.split(',').map((a) => a.trim()).filter(Boolean);
    if (selectedAmenities.length > 0) {
      results = results.filter((b) =>
        selectedAmenities.every((amenity) => new Set<string>(b.amenities).has(amenity))
      );
    }
  }

  if (maxPriceParam) {
    const max = Number(maxPriceParam);
    if (!isNaN(max) && max > 0) {
      results = results.filter((b) => b.price <= max);
    }
  }

  // Sorting
  if (sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'seats') {
    results.sort((a, b) => b.available_seats - a.available_seats);
  }

  return NextResponse.json({
    status: 'success',
    buses: results,
    total: results.length,
    query: { from, to, date, sortBy },
  });
}
