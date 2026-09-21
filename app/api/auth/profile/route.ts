import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { mockDB, localJWTSecret } from '@/lib/mock-db';

export async function PUT(request: NextRequest) {
  let userId: string;
  try {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
    userId = (jwt.verify(token || '', process.env.JWT_SECRET || localJWTSecret) as { userId: string }).userId;
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const body = await request.json().catch(() => null);
  if (!body?.profile || ['firstName', 'lastName', 'bio'].some(key => typeof body.profile[key] !== 'string' || body.profile[key].length > 1000)) {
    return NextResponse.json({ error: 'Invalid profile' }, { status: 400 });
  }
  const { firstName, lastName, bio } = body.profile;
  const user = mockDB.updateUser(userId, { profile: { firstName, lastName, bio } });
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { passwordHash, ...publicUser } = user;
  return NextResponse.json(publicUser);
}
