"use client"

import { SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupAction } from "@/components/ui/sidebar";
import { Plus  } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {

    const router = useRouter()
    return (
        <SidebarHeader>
            <SidebarGroup>
                <SidebarGroupLabel>Sable</SidebarGroupLabel>
                <SidebarGroupAction title="New Chat" onClick={() => {
                    router.refresh() // next.js seems to not re-render unless refreshed in production
                    router.push("/chat")
                }}>
                    <Plus strokeWidth={0.9} /> <span className="sr-only">New Chat</span>
                </SidebarGroupAction>
            </SidebarGroup>
        </SidebarHeader>
    )
}