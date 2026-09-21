import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');

    // Mock benchmark data
    const benchmarks = [
      {
        _id: 'bench_1',
        buildId: 'build_1',
        userId: 'user_1',
        category: 'High-End',
        performanceScore: 95,
        gamingFps: {
          cyberpunk2077: 165,
          starfield: 140,
          forspoken: 120,
        },
        thermals: {
          avgTemp: 62,
          maxTemp: 78,
        },
        createdAt: new Date(),
      },
      {
        _id: 'bench_2',
        buildId: 'build_2',
        userId: 'user_2',
        category: 'Mid-Range',
        performanceScore: 75,
        gamingFps: {
          cyberpunk2077: 95,
          starfield: 85,
          forspoken: 75,
        },
        thermals: {
          avgTemp: 58,
          maxTemp: 72,
        },
        createdAt: new Date(),
      },
    ];

    const filtered = category
      ? benchmarks.filter((b) => b.category === category)
      : benchmarks;

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error('[API] Get benchmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to get benchmarks' },
      { status: 500 }
    );
  }
}
