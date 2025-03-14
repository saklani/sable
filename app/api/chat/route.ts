import { auth } from "@/lib/server/auth";
import { fileSearch } from "@/lib/ai/tools/file-search";
import { withAuth } from "@/lib/server/api/middleware";
import { createResponse, HTTP_400, HTTP_401, HTTP_500 } from "@/lib/server/api/response";
import { GetChatsResponseSchema, PostChatRequestSchema } from "@/lib/server/api/schema";
import { queries } from "@/lib/server/db";
import { generateTitleFromUserMessage } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

/**
 * GET /api/chats
 * Retrieves all chats for the current user
 */
export async function GET() {
    return withAuth(async (userId) => {
        const chats = await queries.getChatsByUserId({ userId });
        const validatedChats = GetChatsResponseSchema.safeParse(chats);
        if (!validatedChats.success) {
            console.error("[Chats Validation Error]", {
                userId,
                errors: validatedChats.error.toString()
            });
            return {
                error: "Invalid chats data format",
                status: 500
            };
        }

        return {
            data: validatedChats.data,
            status: 200
        };
    });
}

function errorHandler(error: unknown) {
    console.error("chat", error)
    if (error == null) {
        return 'unknown error';
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return JSON.stringify(error);
}


async function LimitReached({ userId }: { userId: string }) {
    const plan = await queries.getUserPlan({ userId })
    return (plan && plan.messageUsage >= plan.messageLimit)
}

/**
 * POST /api/chats
 * Creates a new chat or adds a message to an existing chat
 */
export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    })
    if (!session?.user?.id) {
        return HTTP_401;
    }
    try {
        const userId = session.user.id
        const limit = await LimitReached({ userId })
        if (limit) {
            return createResponse({ error: "Message limit reached", status: 429 });
        }

        const body = await request.json();
        const validatedInput = PostChatRequestSchema.safeParse(body);

        if (!validatedInput.success) {
            console.error("[Chat Creation Validation Error]", {
                userId,
                errors: validatedInput.error.message
            });
            return HTTP_400
        }

        const { id, messages, model, currentParentId } = validatedInput.data;
        const chat = await queries.getChat({ id, userId });
        const lastMessage = messages.at(-1);

        if (!lastMessage) {
            return HTTP_400
        }


        // Create new chat if it doesn't exist
        if (!chat) {
            const title = await generateTitleFromUserMessage({
                message: lastMessage.content
            });

            await queries.createChat({ id, title, userId, fileIds: [] });
        }

        // Save user message
        const messageId = randomUUID();
        let oldMessage = null
        if (currentParentId) {
            oldMessage = await queries.getMessage({ id: currentParentId })
        }

        await queries.IncrementUsage({ chatId: id, userId });
        const response = await queries.createMessage({
            ...lastMessage,
            chatId: id,
            id: messageId,
            parentId: currentParentId || null
        });
  
        if (oldMessage) {
            messages[messages.length - 1].content = `In the context of this message ${oldMessage.content}: ${messages[messages.length - 1].content}`
        }
        // Stream AI response
        const result = streamText({
            model: openai(model),
            messages,
            maxSteps: 4,
            onFinish: async ({ text }) => {
                if (text.trim().length > 0) {
                    await queries.createMessage({
                        content: text.trim(),
                        role: "assistant",
                        chatId: id,
                        id: randomUUID(),
                        parentId: null
                    });
                }
            },
            tools: { fileSearch },
        });
        return result.toDataStreamResponse({ getErrorMessage: errorHandler });
    } catch (error) {
        console.error(error)
        return HTTP_500
    }
}