import { NextRequest } from "next/server";
import { withAuth } from "@/lib/server/api/middleware";
import { queries } from "@/lib/server/db";
import { GetPlanResponseSchema, PutPlanResponseSchema } from "@/lib/server/api/schema";


/**
 * GET /api/plan
 * Retrieves the current user's subscription plan
 */
export async function GET() {
    return withAuth(async (userId) => {
        const userPlan = await queries.getUserPlan({ userId })
        const validatedPlan = GetPlanResponseSchema.safeParse(userPlan);
        if (!validatedPlan.success) {
            console.error("[Plan Validation Error]", {
                userId,
                errors: validatedPlan.error.toString()
            });
            return {
                error: "Invalid plan data format",
                status: 500
            };
        }

        return { data: validatedPlan.data, status: 200 };
    })
}

/**
 * PUT /api/plan
 * Updates the user's subscription plan
 */
export async function PUT(request: NextRequest) {
    return withAuth(async (userId) => {
        const body = await request.json();
        const validatedInput = PutPlanResponseSchema.safeParse(body);
        
        if (!validatedInput.success) {
            console.error("[Plan Update Validation Error]", {
                userId,
                errors: validatedInput.error.flatten()
            });
            return {
                error: "Invalid request data",
                status: 400
            };
        }

        // Update plan
        const updatedPlan = await queries.updatePlan({
            userId,
            ...validatedInput.data
        });

        // Validate updated plan
        const validatedPlan = GetPlanResponseSchema.safeParse(updatedPlan);
        if (!validatedPlan.success) {
            console.error("[Updated Plan Validation Error]", {
                userId,
                errors: validatedPlan.error.flatten()
            });
            return {
                error: "Invalid plan data format",
                status: 500
            };
        }

        return { data: validatedPlan.data, status: 200 };
    })
}