import { withAuth } from "@/lib/server/api/middleware";
import { CreateCollectionRequestSchema, GetCollectionResponseSchema, GetCollectionsResponseSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(async (userId) => {

        const body = await request.json();
        const { name, fileIds } = CreateCollectionRequestSchema.parse(body);

        const collection = await queries.createCollection({
            name,
            fileIds,
            userId,
        });

        const validatedCollection = GetCollectionResponseSchema.safeParse(collection);

        if (!validatedCollection.success) {
            console.error("[Collection Validation Error]", validatedCollection.error);
            return {
                error: "Failed to create collection",
                status: 500
            };
        }
  
        return {
            data: validatedCollection.data,
            status: 200
        };
    });
}

export async function GET() {
    return withAuth(async (userId) => {
        const collections = await queries.getCollectionsByUserId({ userId });
        const validatedCollections = GetCollectionsResponseSchema.safeParse(collections);

        if (!validatedCollections.success) {
            console.error("[Collections Validation Error]", validatedCollections.error);
            return {
                error: "Failed to get collections",
                status: 500 
            };
        }

        return {
            data: validatedCollections.data,
            status: 200
        };
    });
}
