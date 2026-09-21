import { NextRequest, NextResponse } from 'next/server';
import { catalog } from '@/lib/catalog';

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const requested = Number(request.nextUrl.searchParams.get('limit') || 50);
  const limit = Number.isFinite(requested) ? Math.max(1, Math.min(100, requested)) : 50;
  const parts = catalog[type.toLowerCase()];
  if (!parts) return NextResponse.json({ error: 'Unknown component type' }, { status: 400 });
  return NextResponse.json({ components: parts.slice(0, limit), total: parts.length });
}
