import { withAuth } from "@/lib/server/api/middleware";
import { queries } from "@/lib/server/db";
import { GetObjectsResponseSchema } from "@/lib/server/api/schema";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id;
        const objects = await queries.getObjectsByCollectionId({ id, userId });
        const validatedObjects = GetObjectsResponseSchema.safeParse(objects);
        if (!validatedObjects.success) {
            return {
                error: "Invalid objects data format",
                status: 500
            }
        }
        return {
            data: objects,
            status: 200
        }
    })
}