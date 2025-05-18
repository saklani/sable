import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { getSubscription, updateSubscription } from '../subscription';
import { setupTestDb, teardownTestDb } from './setup';
import { Pool } from 'pg';

describe('Subscription Lambda Handlers', () => {
  let pool: Pool;
  const mockUserId = 'test-user-id';

  beforeEach(async () => {
    pool = await setupTestDb();
  });

  afterEach(async () => {
    await teardownTestDb(pool);
  });

  it('gets subscription successfully', async () => {
    await pool.query(
      'INSERT INTO subscriptions (user_id, plan, status, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 month\')',
      [mockUserId, 'pro', 'active']
    );

    const response = await getSubscription({
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
    } as any);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.subscription.plan).toBe('pro');
  });

  it('updates subscription successfully', async () => {
    const response = await updateSubscription({
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({
        plan: 'enterprise',
      }),
    } as any);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.subscription.plan).toBe('enterprise');
  });
}); 