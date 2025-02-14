import { S3Storage } from "./s3";

export const objects = new S3Storage({
    bucketName: process.env.AWS_BUCKET_NAME!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
