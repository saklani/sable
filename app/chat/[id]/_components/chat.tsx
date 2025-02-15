"use client"
import { Textarea } from "@/components/ui/textarea"
import { GetMessages, GetMessagesResponse, GetUserPreferences } from "@/lib/client/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useChat } from "ai/react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { AIMessage } from "./ai-message"
import { DataDropdown } from "./data-dropdown"
import { SwitchModels } from "./models"
import { UserMessage } from "./user-message"

export function Chat({ id }: { id: string }) {
    const { data: response1 } = useQuery<GetMessagesResponse>({ queryKey: ["chat", id], queryFn: () => fetch(`/api/chat/${id}/messages`).then(res => res.json()) })
    const { data: response2 } = useQuery<GetUserPreferences>({ queryKey: ["preferences"], queryFn: () => fetch("/api/user/preferences").then(res => res.json()) })

    if (!response1?.data || !response2?.data) {
        return <></>
    }

    return <UnmemoizedChat id={id} initialMessages={response1.data ?? []} model={response2.data.defaultModel} />
}


export function UnmemoizedChat({ id, initialMessages, model }: { id: string, initialMessages: GetMessages, model: string }) {
    const pathname = usePathname()
    const queryClient = useQueryClient()

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        id,
        initialMessages,
        onResponse: () => {
            if (pathname === "/chat") {
                window.history.replaceState(null, '', `/chat/${id}`);
                queryClient.invalidateQueries({ queryKey: ["chats"] })
            }
        },
        onError: (error) => {
            toast(JSON.parse(error.message)["error"])
        },
        body: { model }
    });

    return (
        <div className="flex flex-col flex-1 w-full items-center">
            <div className="flex flex-col overflow-y-auto pt-3 pb-[96px] px-2 w-[calc(100%-24px)] max-w-3xl ">
                {messages.length === 0 ?
                    <h1 className="text-2xl">What can I help with?</h1> :
                    messages.map(m => (
                        <div key={m.id}>
                            {m.role === 'user' ? <UserMessage content={m.content} /> : <AIMessage content={m.content} />}
                        </div>
                    ))}
            </div>
            <div className="bg-background fixed bottom-0 z-1 border border-input pt-0 rounded-lg p-1 pt-0 lg:w-[calc(100%-24px)] w-[500px] max-w-3xl ">
                <form onSubmit={handleSubmit}>
                    <Textarea
                        className="w-full resize-none h-[72px]"
                        value={input}
                        placeholder="Ask anything"
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.shiftKey == false) {
                                e.preventDefault();
                                //@ts-expect-error comvert to form element
                                (e.target.form as HTMLFormElement).requestSubmit();
                            }
                        }}
                    />
                </form>
                <div className="flex h-[32px] px-3 gap-1">
                    <SwitchModels />
                    <DataDropdown id={id}/>
                </div>
            </div>
        </div>
    )
}