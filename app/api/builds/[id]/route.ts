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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Using mockDB
    const build = await mockDB.getBuild((await params).id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    const userId = await getUserIdFromToken(request.headers.get('Authorization') || undefined);
    if (!build.isPublic && build.userId !== userId) return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    return NextResponse.json({
      success: true,
      data: build,
    });
  } catch (error) {
    console.error('[API] Get build error:', error);
    return NextResponse.json(
      { error: 'Failed to get build' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const build = await mockDB.getBuild((await params).id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    if (build.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    let data;
    try { data = buildInput({ ...build, ...body }); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid build' }, { status: 400 }); }
    const updatedBuild = await mockDB.updateBuild((await params).id, data);

    return NextResponse.json({
      success: true,
      data: updatedBuild,
    });
  } catch (error) {
    console.error('[API] Update build error:', error);
    return NextResponse.json(
      { error: 'Failed to update build' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const build = await mockDB.getBuild((await params).id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    if (build.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await mockDB.deleteBuild((await params).id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[API] Delete build error:', error);
    return NextResponse.json(
      { error: 'Failed to delete build' },
      { status: 500 }
    );
  }
}
