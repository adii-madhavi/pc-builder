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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Using mockDB
    const build = await mockDB.likeBuild((await params).id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: build,
    });
  } catch (error) {
    console.error('[API] Like build error:', error);
    return NextResponse.json(
      { error: 'Failed to like build' },
      { status: 500 }
    );
  }
}
