import { memo } from "react"
import type { Message } from "@/lib/client/types"
import { MessageParent } from "./user-quote"
export const UserMessage = memo(({ message }: { message: Message }) => {

    return (
        <div className="flex flex-col items-end gap-2">
            {message.parent && <MessageParent parent={message.parent} />}
            <div className="text-[12.5px] bg-foreground/90 text-background max-w-[500px] border py-3 px-5 rounded-[24px]">
                <p>{message.content}</p>
            </div>
        </div>
    )
})

UserMessage.displayName = "UserMessage"