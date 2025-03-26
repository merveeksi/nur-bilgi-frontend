import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';

// Simple authentication check
function isAuthenticated(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  
  return apiKey === process.env.ADMIN_API_KEY;
}

// Delete a message by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    // Delete the message
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Mesaj başarıyla silindi', id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mesaj silinirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Mesaj silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 