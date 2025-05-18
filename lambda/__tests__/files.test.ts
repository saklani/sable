import { describe, expect, it, vi } from 'vitest';
import { uploadToS3, getFileUrl } from '../files';

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn().mockResolvedValue('https://example.com/signed-url'),
}));

describe('File Lambda Handlers', () => {
  const mockUserId = 'test-user-id';

  it('uploads file successfully', async () => {
    const response = await uploadToS3({
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({
        file: 'base64-encoded-data',
        contentType: 'application/pdf',
      }),
    } as any);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.url).toBe('https://example.com/signed-url');
  });

  it('gets file URL successfully', async () => {
    const response = await getFileUrl({
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      pathParameters: {
        key: 'test-key',
      },
    } as any);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.url).toBe('https://example.com/signed-url');
  });
}); 