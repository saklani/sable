import { withAuth } from "@/lib/server/api/middleware";
import { GetCollectionResponseSchema, UpdateCollectionRequestSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id;
        const collection = await queries.getCollection({ id, userId });

        if (!collection) {
            return {
                error: "Collection not found",
                status: 404
            };
        }

        const validatedCollection = GetCollectionResponseSchema.safeParse(collection);

        if (!validatedCollection.success) {
            console.error("[Collection Validation Error]", validatedCollection.error);
            return {
                error: "Invalid collection data format",
                status: 500
            };
        }

        return {
            data: validatedCollection.data,
            status: 200
        };
    });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id;
        const body = await request.json();

        const validatedBody = UpdateCollectionRequestSchema.safeParse(body);
        
        if (!validatedBody.success) {
            console.error("[Collection Validation Error]", validatedBody.error);
            return {
                error: "Invalid collection data format",
                status: 500
            };
        }

        const collection = await queries.updateCollection({ id, userId, ...validatedBody.data });
        const validatedCollection = GetCollectionResponseSchema.safeParse(collection);

        if (!validatedCollection.success) {
            console.error("[Collection Validation Error]", validatedCollection.error);
            return {
                error: "Invalid collection data format",
                status: 500
            };
        }
        return {
            data: validatedCollection.data,
            status: 200
        };
    });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id;
        await queries.deleteCollection({ id, userId });
        return {
            data: { success: true },
            status: 200
        };
    });
}
