import { eq, sql, lt } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema";
import { execute } from "./utils";


/**
 * Creates a default free plan for new users
*/
export async function createUserPlan({ userId }: Pick<schema.Plan, "userId">) {
    return execute(`create plan of user ${userId}`, async () => {
        await db.insert(schema.plan).values({
            userId,
            type: "free" as const,
            messageUsage: 0,
            messageLimit: 200,
            storageUsage: 0,
            storageLimit: 104857600, // 100MB
            startDate: new Date(),
            isActive: true
        })
    })
}

export async function updatePlan({ userId, ...rest }: Pick<schema.Plan, "userId" | "type" | "messageLimit" | "storageLimit">) {
    return execute(`update plan of user ${userId}`, async () => {
        await db.update(schema.plan).set(rest).where(eq(schema.user.id, userId))
    })
}

export async function deletePlan({ userId }: Pick<schema.Plan, "id" | "userId">) {
    return execute(`delete plan of user ${userId}`, async () => {
        await db.delete(schema.plan).where(eq(schema.plan.userId, userId))
    })
}

export async function getUserPlan({ userId }: Pick<schema.Plan, "userId">) {
    return execute(
        `get plan of user ${userId}`,
        async () => db.query.plan.findFirst({ where: eq(schema.plan.userId, userId) })
    )
}


export async function IncrementUsage({ chatId, userId }: { chatId: string; userId: string }) {
    return execute(
        `check and increment`,
        async () => {
            await db.update(schema.chat).set({ lastMessageAt: new Date() }).where(eq(schema.chat.id, chatId))
            await db.update(schema.plan).set({ messageUsage: sql`${schema.plan.messageUsage} + 1` })
        });
}

export async function resetPlan() {
    return execute(
        `reseting plans`,
        () => db.update(schema.plan).set({
            startDate: sql`(unixepoch())`,
            endDate: sql`(unixepoch() + 28 * 24 * 60 * 60)`
        }).where(lt(schema.plan.endDate, sql`(unixepoch())`))
    )
}


export async function getUserStorageLimit({ userId }: Pick<schema.Plan, "userId">) {
    return execute(`get user ${userId}`, async () => {
        return await db.query.plan.findFirst({ where: eq(schema.plan.userId, userId), columns: { storageLimit: true } })
    })
}