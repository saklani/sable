import React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div className="flex w-screen h-screen">
                <AppSidebar />
                <div className="flex flex-col items-stretch w-full">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}