import { randomUUID } from "crypto";
import { Chat } from "./[id]/_components/chat";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatHeader } from "./[id]/_components/chat-header";


export default function Page() {
    const id = randomUUID()
    return (
        <div className="flex flex-col items-stretch">
            <ChatHeader />
            <Chat id={id} key={id} />
        </div>
    );
}