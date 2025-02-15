import { memo } from "react"

export const UserMessage = memo(function ({ content }: { content: string }) {
    return (
        <div className="flex justify-end w-full">
            <div className="text-sm bg-foreground/90 text-background  max-w-[500px] border py-2 px-4 rounded-full">
                <p>{content}</p>
            </div>
        </div>
    )
})

UserMessage.displayName = "UserMessage"