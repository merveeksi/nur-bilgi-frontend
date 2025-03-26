import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initMessagesTable } from './init-table';

// Initialize messages table
initMessagesTable().catch(console.error);

export async function POST(request: Request) {
  try {
    const { name, email, subject, content } = await request.json();
    console.log('Received message data:', { name, email, subject, content });

    // Validate required fields
    if (!name || !email || !content) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'Ad, e-posta ve mesaj alanları zorunludur' },
        { status: 400 }
      );
    }

    // Test database connection before insert
    try {
      const connectionTest = await pool.query('SELECT NOW()');
      console.log('Database connection verified:', connectionTest.rows[0]);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw new Error('Database connection failed');
    }

    // Create message in database using PostgreSQL
    const insertQuery = `
      INSERT INTO messages (name, email, subject, content, created_at) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, subject, content, created_at
    `;
    const values = [name, email, subject || '', content, new Date()];
    
    console.log('Executing query:', {
      query: insertQuery,
      values: values
    });

    const result = await pool.query(insertQuery, values);
    console.log('Insert result:', result.rows[0]);

    const savedMessage = result.rows[0];

    // Verify the message was saved
    const verifyQuery = await pool.query(
      'SELECT * FROM messages WHERE id = $1',
      [savedMessage.id]
    );
    console.log('Verification query result:', verifyQuery.rows[0]);

    return NextResponse.json({ success: true, data: savedMessage }, { status: 201 });
  } catch (error: any) {
    console.error('Detailed error:', {
      name: error?.name || 'Unknown error',
      message: error?.message || 'No error message available',
      stack: error?.stack || 'No stack trace available'
    });
    
    return NextResponse.json(
      { 
        message: 'Mesaj kaydedilirken bir hata oluştu',
        error: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 