import { describe, it, expect, beforeEach } from 'vitest';
import { signIn, signUp, getCurrentUser } from '../auth';
import { mockDb } from './mockDb';

describe('Auth Lambda Handlers', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockDb.users['mockUsers'] = [];
  });

  it('signs in a user successfully', async () => {
    // Create a test user
    await mockDb.users.create({
      email: 'test@example.com',
      name: 'Test User',
    });

    const event = {
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    };

    const response = await signIn(event as any);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.token).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.email).toBe('test@example.com');
  });

  it('returns 401 for invalid credentials', async () => {
    const event = {
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    };

    const response = await signIn(event as any);
    expect(response.statusCode).toBe(401);
  });

  it('signs up a new user successfully', async () => {
    const event = {
      body: JSON.stringify({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      }),
    };

    const response = await signUp(event as any);
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.token).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.email).toBe('new@example.com');
  });

  it('returns 409 for existing user', async () => {
    // Create a test user
    await mockDb.users.create({
      email: 'existing@example.com',
      name: 'Existing User',
    });

    const event = {
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      }),
    };

    const response = await signUp(event as any);
    expect(response.statusCode).toBe(409);
  });

  it('gets current user successfully', async () => {
    // Create a test user
    const user = await mockDb.users.create({
      email: 'test@example.com',
      name: 'Test User',
    });

    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: user.id,
          },
        },
      },
    };

    const response = await getCurrentUser(event as any);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.user).toBeTruthy();
    expect(body.user.email).toBe('test@example.com');
  });

  it('returns 401 for unauthorized request', async () => {
    const event = {
      requestContext: {
        authorizer: {},
      },
    };

    const response = await getCurrentUser(event as any);
    expect(response.statusCode).toBe(401);
  });
}); 