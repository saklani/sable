import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema";
import { execute } from "./utils";

export async function createCollection({ ...rest }: Omit<schema.Collection,  "id" | "createdAt" | "updatedAt">) {
    return execute(`create collection`, async () =>  db.insert(schema.collection).values({...rest }).returning().then(res => res.at(0)))
}

export async function updateCollection({ id, userId, ...rest }: Partial<schema.Collection> & Pick<schema.Collection, "id" | "userId">) {
    return execute(`update collection ${id}`, async () => db.update(schema.collection).set(rest).where(and(eq(schema.collection.id, id), eq(schema.collection.userId, userId))).returning().then(res => res.at(0)))
}

export async function deleteCollection({ id, userId }: Pick<schema.Collection, "id" | "userId">) {
    return execute(`delete collection ${id} of user ${userId}`, async () => {
        await db.delete(schema.collection).where(and(eq(schema.collection.id, id), eq(schema.collection.userId, userId)))
    })
}

export async function getCollection({ id, userId }: Pick<schema.Collection, "id" | "userId">) {
    return execute(
        `get collection ${id} of user ${userId}`,
        () => db.query.collection.findFirst({ where: and(eq(schema.collection.id, id), eq(schema.collection.userId, userId)) })
    )
}

export async function getCollectionsByUserId({ userId, cursor }: Pick<schema.Collection, "userId"> & {  cursor?: string }) {
    return execute(
        `get all collection of user ${userId}`,
        () => db.query.collection.findMany({ where: and(eq(schema.collection.userId, userId), cursor ? gt(schema.collection.id, cursor) : undefined), orderBy: asc(schema.collection.name) })
    )
}