import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export async function ChatHeader({id}: {id: string}) {
    return (
        <div className="sticky bg-header top-0 z-10 flex gap-3 p-2 items-center border-b w-full justify-between">
            <SidebarTrigger />
            {/* <form action={
                async () => {
                    "use server"
                    redirect(`/chat/${id}/manage`)
                }
            }>
                <Button variant={"ghost"} disabled>Manage</Button>
            </form> */}
        </div>
    )
}