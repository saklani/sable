import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export default function Page() {
    const id = randomUUID();
    
    redirect(`/chat/${id}?`);
}