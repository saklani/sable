import { withAuth } from "@/lib/server/api/middleware";
import { GetObjectResponseSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";
import { objects } from "@/lib/server/store/objects";
import { generateTitleFromUserMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

/**
 * POST /api/file
 */
export async function POST(request: NextRequest) {
    return withAuth(async (userId) => {
        const formData = await request.formData();
        const chatId = formData.get('chat-id') as string;
        const file = formData.get('file') as File;
        if (!file) {
            return { error: "No file provided", status: 400 };
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return { error: "File size exceeds 10MB limit", status: 400 };
        }

        const userPlan = await queries.getUserPlan({ userId });
        if (!userPlan) {
            return { error: "No user plan found", status: 500 };
        }

        if (userPlan.storageUsage + file.size > userPlan.storageLimit) {
            return {
                error: "Storage limit exceeded",
                status: 400
            };
        }

        const fileId: string = randomUUID().toString();

        await queries.createObject({
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            metadata: "",
            userId,
        });

        const url = await objects.upload({
            file,
            id: fileId,
            userId,
        });

        const updatedObject = await queries.updateObject({
            id: fileId,
            userId,
            url,
            status: 'processing',
        });

        let chat = await queries.getChat({ id: chatId, userId });
        if (!chat) {
            const title = "New chat";
            const collection = await queries.createCollection({
                name: title,
                userId,
                fileIds: [fileId],
            });
            if (!collection) {
                return { error: "Failed to create collection", status: 500 };
            }
            chat = await queries.createChat({
                id: chatId,
                title,
                userId,
                collectionId: collection.id,
            });
        }

        if (!chat?.collectionId) {
            return { error: "No collection found", status: 400 };
        } else {
            const collection = await queries.getCollection({ id: chat.collectionId, userId });
            if (!collection) {
                return { error: "No collection found", status: 400 };
            }
            await queries.updateCollection({
                id: chat.collectionId,
                userId,
                fileIds: [...(collection.fileIds ?? []), fileId],
            });
        }

        const validateObject = GetObjectResponseSchema.safeParse(updatedObject);
        if (!validateObject.success) {
            console.error("[Data Validation Error]", validateObject.error);
            return {
                error: "Invalid response data format",
                status: 500
            };
        }
        return {
            data: validateObject.data,
            status: 200
        };
    });
}

