import { localJWTSecret } from '@/lib/mock-db';
import { NextRequest, NextResponse } from 'next/server';
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

// Mock forum posts
const forumPosts = [
  {
    _id: 'post_1',
    userId: 'user_1',
    title: 'Best CPU for gaming in 2026?',
    category: 'General',
    content: 'Looking for recommendations on the best CPU for gaming...',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 15,
    replies: 8,
  },
  {
    _id: 'post_2',
    userId: 'user_2',
    title: 'My first PC build!',
    category: 'Showcase',
    content: 'Finally completed my first PC build after months of planning...',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 42,
    replies: 23,
  },
];

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');

    const filtered = category
      ? forumPosts.filter((p) => p.category === category)
      : forumPosts;

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error('[API] Get forum posts error:', error);
    return NextResponse.json(
      { error: 'Failed to get forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('Authorization') || undefined);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, content } = body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = {
      _id: `post_${Date.now()}`,
      userId,
      title,
      category,
      content,
      createdAt: new Date(),
      likes: 0,
      replies: 0,
    };

    forumPosts.push(newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error('[API] Create forum post error:', error);
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}
