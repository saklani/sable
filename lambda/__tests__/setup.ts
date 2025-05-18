import { Pool } from 'pg';

export const setupTestDb = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL UNIQUE,
      plan VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )
  `);

  return pool;
};

export const teardownTestDb = async (pool: Pool) => {
  await pool.query('DROP TABLE IF EXISTS subscriptions');
  await pool.end();
}; 