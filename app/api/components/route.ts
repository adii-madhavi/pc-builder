import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const brand = searchParams.get('brand');
    const maxPrice = searchParams.get('maxPrice');
    const limit = searchParams.get('limit');

    const query: any = {};
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (maxPrice) query.maxPrice = parseInt(maxPrice);
    if (limit) query.limit = parseInt(limit);

    // Using mockDB
    const components = mockDB.getComponents(query);

    return NextResponse.json({
      success: true,
      data: components,
    });
  } catch (error) {
    console.error('[API] Get components error:', error);
    return NextResponse.json(
      { error: 'Failed to get components' },
      { status: 500 }
    );
  }
}
