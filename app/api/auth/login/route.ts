import { getJWTSecret } from '@/lib/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''; 

    if (!email || typeof password !== 'string' || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await mockDB.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      await getJWTSecret(),
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
