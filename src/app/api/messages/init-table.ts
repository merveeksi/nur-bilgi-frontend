import pool from '@/lib/db';

export async function initMessagesTable() {
  try {
    // Test database connection first
    const testConnection = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', testConnection.rows[0]);

    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Verify table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
      );
    `);
    
    console.log('Messages table exists:', tableCheck.rows[0].exists);
    console.log('Messages table initialized successfully');
  } catch (error) {
    console.error('Error initializing messages table:', error);
    throw error; // Rethrow to see the full error
  }
}

// Run on server start in development
if (process.env.NODE_ENV === 'development') {
  initMessagesTable().catch(console.error);
} 