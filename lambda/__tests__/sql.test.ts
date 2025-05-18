import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Pool } from 'pg';
import { setupTestDb, teardownTestDb } from './setup';

describe('SQL Queries', () => {
  let pool: Pool;

  beforeEach(async () => {
    pool = await setupTestDb();
  });

  afterEach(async () => {
    await teardownTestDb(pool);
  });

  it('creates and retrieves subscription', async () => {
    const userId = 'test-user';
    await pool.query(
      'INSERT INTO subscriptions (user_id, plan, status, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 month\')',
      [userId, 'pro', 'active']
    );

    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    expect(result.rows[0].plan).toBe('pro');
    expect(result.rows[0].status).toBe('active');
  });

  it('updates subscription plan', async () => {
    const userId = 'test-user';
    await pool.query(
      'INSERT INTO subscriptions (user_id, plan, status, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 month\')',
      [userId, 'free', 'active']
    );

    await pool.query(
      'UPDATE subscriptions SET plan = $1 WHERE user_id = $2',
      ['pro', userId]
    );

    const result = await pool.query(
      'SELECT plan FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    expect(result.rows[0].plan).toBe('pro');
  });

  it('handles subscription expiration', async () => {
    const userId = 'test-user';
    await pool.query(
      'INSERT INTO subscriptions (user_id, plan, status, expires_at) VALUES ($1, $2, $3, NOW() - INTERVAL \'1 day\')',
      [userId, 'pro', 'active']
    );

    await pool.query(
      'UPDATE subscriptions SET status = \'expired\' WHERE expires_at < NOW()'
    );

    const result = await pool.query(
      'SELECT status FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    expect(result.rows[0].status).toBe('expired');
  });
}); 