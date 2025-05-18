import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'pg';
import { ListVoicesResponse, Voice } from './schema';

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

export const listVoices = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const client = await pool.connect();
    const result = await client.query<Voice>(
      'SELECT id, name, language, gender, preview_url as "previewUrl" FROM voices ORDER BY name'
    );
    client.release();

    const response: ListVoicesResponse = {
      voices: result.rows,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('List voices error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const getVoice = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return createResponse(400, { message: 'Voice ID is required' });
    }

    const client = await pool.connect();
    const result = await client.query<Voice>(
      'SELECT id, name, language, gender, preview_url as "previewUrl" FROM voices WHERE id = $1',
      [id]
    );
    client.release();

    if (result.rows.length === 0) {
      return createResponse(404, { message: 'Voice not found' });
    }

    return createResponse(200, { voice: result.rows[0] });
  } catch (error) {
    console.error('Get voice error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
}; 