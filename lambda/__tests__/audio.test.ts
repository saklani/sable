import { describe, expect, it } from 'vitest';
import { deleteItem, generateAudio, getItem, listItems, uploadFile } from '../audio';
import { mockDb } from './mockDb';

describe('Audio Lambda Handlers', () => {
  const mockUserId = 'test-user-id';

  it('lists items successfully', async () => {
    // Create test items
    await mockDb.audioItems.create({
      title: 'Test Audio 1',
      type: 'file',
      tags: ['test'],
    });

    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
    };

    const response = await listItems(event as any);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).items).toHaveLength(3);
  });

  it('gets item successfully', async () => {
    // Create test item
    const item = await mockDb.audioItems.create({
      title: 'Test Audio',
      type: 'file',
      tags: ['test'],
    });

    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      pathParameters: {
        id: item.id,
      },
    };

    const response = await getItem(event as any);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).item).toBeTruthy();
  });

  it('generates audio from text successfully', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({
        text: 'This is a test text for audio generation',
      }),
    };

    const response = await generateAudio(event as any);
    expect(response.statusCode).toBe(202);
    const body = JSON.parse(response.body);
    expect(body.id).toBeTruthy();
    expect(body.status).toBe('processing');
  });

  it('returns 400 for missing text in audio generation', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({}),
    };

    const response = await generateAudio(event as any);
    expect(response.statusCode).toBe(400);
  });

  it('uploads file successfully', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({
        file: 'base64-encoded-file-data',
      }),
    };

    const response = await uploadFile(event as any);
    expect(response.statusCode).toBe(202);
    const body = JSON.parse(response.body);
    expect(body.id).toBeTruthy();
    expect(body.status).toBe('processing');
  });

  it('returns 400 for missing file in upload', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      body: JSON.stringify({}),
    };

    const response = await uploadFile(event as any);
    expect(response.statusCode).toBe(400);
  });

  it('deletes item successfully', async () => {
    // Create test item
    const item = await mockDb.audioItems.create({
      title: 'Test Audio',
      type: 'file',
      tags: ['test'],
    });

    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockUserId,
          },
        },
      },
      pathParameters: {
        id: item.id,
      },
    };

    const response = await deleteItem(event as any);
    expect(response.statusCode).toBe(204);
  });
}); 