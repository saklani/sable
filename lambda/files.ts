import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUploadResponse } from './schema';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const uploadToS3 = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const { file, contentType } = JSON.parse(event.body || '{}');
    if (!file || !contentType) {
      return createResponse(400, { message: 'File and content type are required' });
    }

    const key = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const buffer = Buffer.from(file, 'base64');

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }));

    const url = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }), { expiresIn: 3600 });

    const response: FileUploadResponse = {
      id: key,
      url,
      key,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('Upload to S3 error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};

export const getFileUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return createResponse(401, { message: 'Unauthorized' });
    }

    const key = event.pathParameters?.key;
    if (!key) {
      return createResponse(400, { message: 'File key is required' });
    }

    const url = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }), { expiresIn: 3600 });

    return createResponse(200, { url });
  } catch (error) {
    console.error('Get file URL error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
}; 