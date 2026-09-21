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
    const username = typeof body.username === 'string' ? body.username.trim() : ''; 

    // Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6 || Buffer.byteLength(password) > 72) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters and no more than 72 bytes' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (await mockDB.getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await mockDB.createUser(username, email, passwordHash);

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
    console.error('[API] Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
