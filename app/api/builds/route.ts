import { buildInput } from '@/lib/build-input';
import { getJWTSecret } from '@/lib/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import jwt from 'jsonwebtoken';


async function getUserIdFromToken(authHeader?: string): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, await getJWTSecret()) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId || !await mockDB.getUserById(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Using mockDB
    const builds = await mockDB.getUserBuilds(userId);

    return NextResponse.json({
      success: true,
      data: builds,
    });
  } catch (error) {
    console.error('[API] Get builds error:', error);
    return NextResponse.json(
      { error: 'Failed to get builds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId || !await mockDB.getUserById(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let data;
    try { data = buildInput(await request.json()); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid build' }, { status: 400 }); }
    const build = await mockDB.createBuild(userId, data);

    return NextResponse.json({
      success: true,
      data: build,
    });
  } catch (error) {
    console.error('[API] Create build error:', error);
    return NextResponse.json(
      { error: 'Failed to create build' },
      { status: 500 }
    );
  }
}
