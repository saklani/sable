import { withAuth } from "@/lib/server/api/middleware";
import { GetObjectResponseSchema } from "@/lib/server/api/schema";
import { objects } from "@/lib/server/store/objects";
import { NextRequest } from "next/server";

/**
 * GET /api/objects/[id]
 * Retrieves a pre-signed URL for file download
 */
export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAuth(async (userId) => {
        const id = (await params).id
        const url = await objects.get({ id, userId });

        // Validate response data
        const validatedResponse = GetObjectResponseSchema.safeParse({ url });
        if (!validatedResponse.success) {
            console.error("[Data Validation Error]", validatedResponse.error);
            return {
                error: "Invalid response data format",
                status: 500
            };
        }

        return {
            data: validatedResponse.data,
            status: 200
        };
    });
}

/**
 * DELETE /api/objects/[id]
 * Deletes a file from storage
 */
export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAuth(async (userId) => {
        const id = (await params).id
        await objects.remove({ id, userId });

        return {
            data: { success: true },
            status: 200
        };
    });
}
