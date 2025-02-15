import { randomUUID } from "crypto";
import { Chat } from "./[id]/_components/chat";
import { ChatHeader } from "./[id]/_components/chat-header";


export default function Page() {
    const id = randomUUID()
    return (
        <div className="flex flex-col items-stretch">
            <ChatHeader id={id} />
            <Chat id={id} key={id} />
        </div>
    );
}