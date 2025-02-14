"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Delete, Ellipsis, Share } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { GetChats } from "@/lib/client/types"

export function Content() {

    const { data: response } = useQuery<GetChats>({
        queryKey: ["chats"],
        queryFn: () => fetch("/api/chat").then(res => res.json())
    })

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu className="overflow-y-scroll">
                        {response && response.data && response.data.map((chat) => (<ChatItem key={chat.id} id={chat.id} title={chat.title} />))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}


function ChatItem({ id, title }: { id: string; title: string; }) {

    const pathname = usePathname()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: ({ id }: { id: string }) => fetch(`/api/chat/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            router.push("/chat")
        },
    })
    return (
        <SidebarMenuItem key={id} className={pathname.split('/').at(-1) === id ? "bg-sidebar-select" : ""}>
            <SidebarMenuButton
                onClick={() => router.push(`/chat/${id}`)}>
                <span>{title}</span>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover={true}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Ellipsis size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem disabled>
                            <p className="text-2xs">Share</p>
                            <DropdownMenuShortcut><Share size={14} /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => mutate({ id })}>
                            <p className="text-2xs text-red-400">Delete</p>
                            <DropdownMenuShortcut><Delete size={14} className="text-red-400" /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuAction>
        </SidebarMenuItem>
    )
}


