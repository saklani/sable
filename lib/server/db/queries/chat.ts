import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../schema";
import { execute } from "./utils";


export async function createChat({ id, ...rest }: Pick<schema.Chat, "id" | "title" | "userId" | "collectionId">) {
    return execute(`create chat: ${id}`, async () =>  db.insert(schema.chat).values({ id, ...rest }).returning().then(res => res.at(0)))
}

export async function upsertChat({ id, ...rest }: Omit<schema.Chat, "createdAt">) {
    return execute(`create chat: ${id}`, async () => {
        return await db.insert(schema.chat).values({ id, ...rest }).onConflictDoUpdate({ target: schema.chat.id, set: { ...rest } }).returning()
    })
}

export async function updateChat({ id, userId, ...rest }: schema.Chat) {
    return execute(`update chat ${id}`, async () => {
        await db.update(schema.chat).set(rest).where(and(eq(schema.chat.id, id), eq(schema.chat.userId, userId)))
        return id
    })
}

export async function deleteChat({ id, userId }: Pick<schema.Chat, "id" | "userId">) {
    return execute(`delete chat ${id} of user ${userId}`, async () => {
        await db.delete(schema.chat).where(and(eq(schema.chat.id, id), eq(schema.chat.userId, userId)))
    })
}

export async function getChat({ id, userId }: Pick<schema.Chat, "id" | "userId">) {
    return execute(
        `get chat ${id} of user ${userId}`,
        () => db.query.chat.findFirst({ where: and(eq(schema.chat.id, id), eq(schema.chat.userId, userId)) })
    )
}

export async function getChatsByUserId({ userId, cursor }: Pick<schema.Chat, "userId"> & {  cursor?: string }) {
    return execute(
        `get all chat of user ${userId}`,
        () => db.query.chat.findMany({ where: and(eq(schema.chat.userId, userId), cursor ? gt(schema.chat.id, cursor) : undefined), orderBy: desc(schema.chat.lastMessageAt) })
    )
}