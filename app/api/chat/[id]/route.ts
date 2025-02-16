import { withAuth } from "@/lib/server/api/middleware";
import { GetChatResponseSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id
        if (!id) {
            return { error: "Invalid request data", status: 400 }
        }
        const chat = await queries.getChat({ id, userId });
        const validatedChat = GetChatResponseSchema.safeParse(chat);
        if (!validatedChat.success) {
            console.error("[Chats Validation Error]", {
                userId,
                errors: validatedChat.error.toString()
            });
            return {
                error: "Chat not found",
                status: 404
            };
        }

        return {
            data: validatedChat.data,
            status: 200
        };
    });
}


export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return withAuth(async (userId) => {
        const id = (await params).id
        if (!id) {
            return { error: "Invalid request data", status: 400 }
        }
        await queries.deleteChat({ id, userId });
    
        return {
            data: { success: true },
            status: 200
        };
    });
}

