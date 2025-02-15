import { memo } from "react";
import { Markdown } from "./markdown";

export const AIMessage = memo(function ({ content }: { action?: string; content: string; }) {
    return (
        <div className="flex w-full py-[24px] gap-[8px]">
            <div className="flex flex-col w-full py-2 px-6">
                <Markdown>{content}</Markdown>
            </div>
        </div>
    )
})

AIMessage.displayName = "AIMessage"