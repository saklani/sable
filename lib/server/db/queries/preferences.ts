import { eq } from 'drizzle-orm';
import { schema } from '..';
import { db } from "../db";
import { execute } from "./utils";

export async function createUserPreferences({ userId }: Pick<schema.UserPreferences, "userId">) {
    return execute('insert user preference', async () => {
        await db.insert(schema.userPreferences).values({ userId })
        return userId
    })
}

export async function updateUserPreferences({ userId, defaultModel }: schema.UserPreferences) {
    return execute(`update user ${userId}`, async () => {
        await db.update(schema.userPreferences).set({ defaultModel }).where(eq(schema.userPreferences.userId, userId))
        return userId
    })
}

export async function getUserPreferences({ userId }: Pick<schema.UserPreferences, "userId">) {
    return execute(`get user ${userId}`, async () => {
        return await db.query.userPreferences.findFirst({ where: eq(schema.userPreferences.userId, userId), columns: { defaultModel: true } })
    })
}

