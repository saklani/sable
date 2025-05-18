import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockDb } from './__tests__/mockDb';
import { User } from './types';

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const signIn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    
    if (!email || !password) {
      return createResponse(400, { message: 'Email and password are required' });
    }

    const user = await mockDb.users.findByEmail(email);
    if (!user) {
      return createResponse(401, { message: 'Invalid credentials' });
    }

    // In a real app, verify password with Cognito and get token
    const token = 'mock-jwt-token'; // This would come from Cognito in production
    return createResponse(200, { token, user });
  } catch (error) {
    console.error('Sign in error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const signUp = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password, name } = JSON.parse(event.body || '{}');
    
    if (!email || !password || !name) {
      return createResponse(400, { message: 'Email, password, and name are required' });
    }

    const existingUser = await mockDb.users.findByEmail(email);
    if (existingUser) {
      return createResponse(409, { message: 'User already exists' });
    }

    // In a real app, create user in Cognito and get token
    const user = await mockDb.users.create({ email, name });
    const token = 'mock-jwt-token'; // This would come from Cognito in production
    return createResponse(201, { token, user });
  } catch (error) {
    console.error('Sign up error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const getCurrentUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const user = await mockDb.users.findById(userId);
    if (!user) {
      return createResponse(404, { message: 'User not found' });
    }

    return createResponse(200, { user });
  } catch (error) {
    console.error('Get current user error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const signOut = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    // In a real app, invalidate the token in Cognito
    return createResponse(200, { message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
}; 