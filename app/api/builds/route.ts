import { buildInput } from '@/lib/build-input';
import { localJWTSecret } from '@/lib/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || localJWTSecret;

function getUserIdFromToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId || !mockDB.getUserById(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Using mockDB
    const builds = mockDB.getUserBuilds(userId);

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
    const userId = getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId || !mockDB.getUserById(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let data;
    try { data = buildInput(await request.json()); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid build' }, { status: 400 }); }
    const build = mockDB.createBuild(userId, data);

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
