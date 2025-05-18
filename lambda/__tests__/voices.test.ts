import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { listVoices, getVoice } from '../voices';
import { Pool } from 'pg';

describe('Voice Lambda Handlers', () => {
  let pool: Pool;

  beforeEach(async () => {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voices (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        preview_url VARCHAR(255)
      )
    `);
    await pool.query(`
      INSERT INTO voices (name, language, gender, preview_url)
      VALUES 
        ('John', 'en-US', 'male', 'https://example.com/john.mp3'),
        ('Sarah', 'en-US', 'female', 'https://example.com/sarah.mp3')
    `);
  });

  afterEach(async () => {
    await pool.query('DROP TABLE IF EXISTS voices');
    await pool.end();
  });

  it('lists voices successfully', async () => {
    const response = await listVoices({} as any);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.voices).toHaveLength(2);
    expect(body.voices[0].name).toBe('John');
  });

  it('gets voice successfully', async () => {
    const response = await getVoice({
      pathParameters: { id: '1' },
    } as any);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.voice.name).toBe('John');
  });

  it('returns 404 for non-existent voice', async () => {
    const response = await getVoice({
      pathParameters: { id: '999' },
    } as any);
    expect(response.statusCode).toBe(404);
  });
}); 