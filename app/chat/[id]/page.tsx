import { Chat } from "./_components/chat/chat";
import { ChatHeader } from "./_components/chat/chat-header";

export default async function Page({ params }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-stretch">
            <ChatHeader id={id} />
            <div className="flex">
                <Chat
                    id={id}
                    key={id}
                />
            </div>
        </div>
    );
}