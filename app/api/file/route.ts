import { withAuth } from "@/lib/server/api/middleware";
import { GetUserResponseSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";

/**
 * POST /api/file
 */
export async function POST() {
    return withAuth(async (userId) => {
        const user = await queries.getUser({ id: userId });

        if (!user) {
            return {
                error: "User not found",
                status: 404
            };
        }

        // Validate user data against schema
        const validatedUser = GetUserResponseSchema.safeParse(user);
        if (!validatedUser.success) {
            console.error("[Data Validation Error]", validatedUser.error);
            return {
                error: "Invalid user data format",
                status: 500
            };
        }
        return {
            data: validatedUser.data,
            status: 200
        };
    });
}
