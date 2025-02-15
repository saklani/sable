import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema";
import { execute } from "./utils";


export async function createObject({ id, ...rest }: Omit<schema.Object, "createdAt" | "status" | "updatedAt" | "url">) {
    return execute(`create object: ${id}`, async () => {
        await db.insert(schema.object).values({ id, ...rest })
        return id
    })
}

export async function updateObject({ id, ...rest }: Pick<schema.Object, "id"> & Partial<schema.Object>) {
    return execute(`update object: ${id}`, async () => (await db.update(schema.object).set({ ...rest }).where(eq(schema.object.id, id)).returning()).at(0))
}

export async function deleteObject({ id, userId }: Pick<schema.Object, "id" | "userId">) {
    return execute(`delete object ${id} of user ${userId}`, async () => {
        await db.delete(schema.object).where(and(eq(schema.object.id, id), eq(schema.object.userId, userId)))
    })
}

export async function getObject({ id, userId }: Pick<schema.Object, "id" | "userId">) {
    return execute(`get object ${id} of user ${userId}`, async () => {
        return db.select().from(schema.object).where(and(eq(schema.object.id, id), eq(schema.object.userId, userId)))
    })
}

export async function getObjectsByUserId({ userId }: Pick<schema.Object, "userId">) {
    return execute(`get all object of user ${userId}`, async () => {
        return db.select().from(schema.object).where(eq(schema.object.userId, userId)).orderBy(desc(schema.object.createdAt))
    })
}