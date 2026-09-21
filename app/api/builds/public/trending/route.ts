import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    // Using mockDB
    const publicBuilds = mockDB.getPublicBuilds();

    return NextResponse.json({
      success: true,
      data: publicBuilds,
    });
  } catch (error) {
    console.error('[API] Get public builds error:', error);
    return NextResponse.json(
      { error: 'Failed to get public builds' },
      { status: 500 }
    );
  }
}
