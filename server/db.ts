import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('tendersense.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT,
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expiry INTEGER,
    google_id TEXT,
    created_at INTEGER NOT NULL
  )
`);

// Ensure Demo Account Exists
try {
  const demoEmail = 'demo@tendersense.com';
  const hashedPassword = bcrypt.hashSync('Demo12345', 12);
  
  db.prepare(`
    INSERT INTO users (id, email, hashed_password, is_verified, created_at)
    VALUES (?, ?, ?, 1, ?)
    ON CONFLICT(email) DO UPDATE SET
      hashed_password = excluded.hashed_password,
      is_verified = 1
  `).run('demo-user-id', demoEmail, hashedPassword, Date.now());
  
  console.log('✅ Built-in demo account ensured & hardened.');
} catch (error) {
  console.error('Quietly handled demo account seeding error:', error);
}

export default db;
