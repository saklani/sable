import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockDb } from './__tests__/mockDb';
import { GenerateAudioResponse, UploadFileResponse } from './schema';

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const listItems = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const items = await mockDb.audioItems.findAll(userId);
    return createResponse(200, { items });
  } catch (error) {
    console.error('List items error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const getItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const id = event.pathParameters?.id;
    if (!id) {
      return createResponse(400, { message: 'Item ID is required' });
    }

    const item = await mockDb.audioItems.findById(id);
    if (!item) {
      return createResponse(404, { message: 'Item not found' });
    }

    return createResponse(200, { item });
  } catch (error) {
    console.error('Get item error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const createItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const item = JSON.parse(event.body || '{}');
    if (!item.title || !item.type) {
      return createResponse(400, { message: 'Title and type are required' });
    }

    const newItem = await mockDb.audioItems.create(item);
    return createResponse(201, { item: newItem });
  } catch (error) {
    console.error('Create item error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const updateItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const id = event.pathParameters?.id;
    if (!id) {
      return createResponse(400, { message: 'Item ID is required' });
    }

    const updates = JSON.parse(event.body || '{}');
    const updatedItem = await mockDb.audioItems.update(id, updates);
    if (!updatedItem) {
      return createResponse(404, { message: 'Item not found' });
    }

    return createResponse(200, { item: updatedItem });
  } catch (error) {
    console.error('Update item error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const generateAudio = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const { text } = JSON.parse(event.body || '{}');
    if (!text) {
      return createResponse(400, { message: 'Text is required' });
    }

    // Create initial response with processing status
    const id = String(Date.now());
    const response: GenerateAudioResponse = {
      id,
      status: 'processing'
    };

    // In a real app, this would trigger an async process to generate the audio
    // For now, we'll simulate it with a mock response
    setTimeout(async () => {
      const audioUrl = 'https://example.com/audio.mp3'; // This would be the actual generated audio URL
      await mockDb.audioItems.create({
        title: text.slice(0, 50) + '...',
        type: 'text',
        text,
        fileUrl: audioUrl,
        tags: ['generated'],
      });
    }, 1000);

    return createResponse(202, response);
  } catch (error) {
    console.error('Generate audio error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const uploadFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const { file } = JSON.parse(event.body || '{}');
    if (!file) {
      return createResponse(400, { message: 'File is required' });
    }

    // Create initial response with processing status
    const id = String(Date.now());
    const response: UploadFileResponse = {
      id,
      status: 'processing'
    };

    // In a real app, this would:
    // 1. Upload the file to S3
    // 2. Trigger OCR/text extraction
    // 3. Store the extracted text
    setTimeout(async () => {
      const extractedText = 'This is the extracted text from the file...'; // This would be the actual extracted text
      await mockDb.audioItems.create({
        title: 'Uploaded File',
        type: 'file',
        text: extractedText,
        fileUrl: 'https://example.com/uploaded-file.pdf', // This would be the actual file URL
        tags: ['uploaded'],
      });
    }, 1000);

    return createResponse(202, response);
  } catch (error) {
    console.error('Upload file error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const deleteItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const id = event.pathParameters?.id;
    if (!id) {
      return createResponse(400, { message: 'Item ID is required' });
    }

    const success = await mockDb.audioItems.delete(id);
    if (!success) {
      return createResponse(404, { message: 'Item not found' });
    }

    return createResponse(204, null);
  } catch (error) {
    console.error('Delete item error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
}; 