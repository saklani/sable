import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'pg';
import { Subscription, SubscriptionResponse } from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const getSubscription = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const client = await pool.connect();
    const result = await client.query<Subscription>(
      'SELECT * FROM subscriptions WHERE user_id = $1',
      [userId]
    );
    client.release();

    if (result.rows.length === 0) {
      return createResponse(404, { message: 'Subscription not found' });
    }

    const response: SubscriptionResponse = {
      subscription: result.rows[0],
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('Get subscription error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const updateSubscription = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const { plan } = JSON.parse(event.body || '{}');
    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return createResponse(400, { message: 'Invalid plan' });
    }

    const client = await pool.connect();
    const result = await client.query<Subscription>(
      `INSERT INTO subscriptions (user_id, plan, status, expires_at)
       VALUES ($1, $2, 'active', NOW() + INTERVAL '1 month')
       ON CONFLICT (user_id) DO UPDATE
       SET plan = $2, status = 'active', expires_at = NOW() + INTERVAL '1 month'
       RETURNING *`,
      [userId, plan]
    );
    client.release();

    const response: SubscriptionResponse = {
      subscription: result.rows[0],
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('Update subscription error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
}; 