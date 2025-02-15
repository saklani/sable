"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { File } from "lucide-react";

function FileUpload() {
    return (
        <DropdownMenuItem onClick={() => { document.getElementById("input-file")?.click() }}>
            <p>Upload File</p>
            <Input
                id={"input-file"}
                type="file"
                onChange={(event) => {
                    console.log(event)
                    console.log(event.target)
                }}
                multiple
                className="hidden"
            />
        </DropdownMenuItem>


    )
}


function ManageData() {
    return (
        <DropdownMenuItem onClick={() => { }}>
            <p>Manage data chat</p>
        </DropdownMenuItem>
    )
}

export function DataDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled>
                <Button variant={"outline"} size={"icon"}>
                    <File />
                    <span className="sr-only">File options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[200px]">
                <FileUpload />
                <ManageData />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

