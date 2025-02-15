import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IStoreProvider } from "./store-provider-interface";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface S3StorageConfig {
    region?: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    expirySeconds?: number;
}


export class S3Storage implements IStoreProvider {
    private client: S3Client;
    private bucketName: string;
    private expirySeconds: number;

    constructor(config: S3StorageConfig) {
        this.client = new S3Client({
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            region: "us-east-1"
        });
        this.bucketName = config.bucketName;
        this.expirySeconds = config.expirySeconds || 3600; // Default 1 hour expiry
    }

    /**
     * Generates a consistent S3 key for a given user's file
     */
    private generateKey(userId: string, id: string): string {
        return `${userId}/${id}`.replace(/\/+/g, '/');
    }

    /**
     * Uploads a file to S3 and returns its URL
     * @throws {Error} If upload fails or parameters are invalid
     */
    async upload({ file, id, userId }: { id: string; userId: string; file: File }): Promise<string> {
        try {
            const key = this.generateKey(userId, id);
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: await file.bytes(),
                ContentType: file.type,
            });

            await this.client.send(command);

            return `https://${this.bucketName}.s3.us-east-1.amazonaws.com/${key}`;
        } catch (error) {
            console.error("S3 upload error:", error);
            throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
        }
    }

    /**
     * Generates a pre-signed URL for temporary file access
     * @throws {Error} If URL generation fails
     */
    async get({ id, userId }: { id: string; userId: string }): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: this.generateKey(userId, id),
            });

            //@ts-ignore
            return getSignedUrl(this.client, command, { expiresIn: this.expirySeconds });
        } catch (error) {
            console.error("S3 get error:", error);
            throw new Error(`Failed to generate pre-signed URL: ${(error as Error).message}`);
        }
    }

    /**
     * Removes a file from S3
     * @throws {Error} If deletion fails
     */
    async remove({ id, userId }: { id: string; userId: string }): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: this.generateKey(userId, id),
            });
            await this.client.send(command);
        } catch (error) {
            console.error("S3 delete error:", error);
            throw new Error(`Failed to delete file from S3: ${(error as Error).message}`);
        }
    }
}