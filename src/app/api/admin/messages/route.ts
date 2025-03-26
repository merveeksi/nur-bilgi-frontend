import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';

// Very simple authentication check - you should improve this in production
function isAuthenticated(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  
  // In production, use a secure authentication method
  // For now, just check if the API key is present (for development only)
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function GET(request: Request) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all messages, ordered by creation date (newest first)
    const result = await pool.query(`
      SELECT id, name, email, subject, content, created_at
      FROM messages
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ messages: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Mesajlar alınırken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Mesajlar alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 