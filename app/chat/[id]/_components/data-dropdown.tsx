"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { File } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react";

function FileUpload({ mutate }: { mutate: ({ body }: { body: FormData }) => void }) {
    return (
        <div className="gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-muted cursor-default" onClick={() => { document.getElementById("input-file")?.click() }}>
            <p>Upload File</p>
            <Input
                id={"input-file"}
                type="file"
                onChange={(event) => {
                    if (event?.target?.files && event?.target?.files[0]) {
                        console.log(event.target.files[0].name)
                        const body = new FormData()
                        body.append("file", event.target.files[0])
                        mutate({ body: body })
                    }
                }}
                className="hidden"
            />
        </div>
    )
}


function ConnectGoogleDrive() {
    return (
        <div className="gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-muted cursor-default" onClick={() => { }}>
            <p>Select from Google Drive</p>
        </div>
    )
}

export function DataDropdown({id}: {id: string}) {
    const [open, setOpen] = useState(false)
    const { mutate, status } = useMutation({
        mutationKey: ["object-post"],
        mutationFn: async ({ body }: { body: FormData }) => {
            setOpen(false)
            body.append("chat-id", id)
            await fetch("/api/store/object", { method: "POST", body })
        }
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button status={status} variant={"outline"} size={"icon"}>
                    <File />
                    <span className="sr-only">File options</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="flex flex-col items-stretch gap-2 p-1 w-[200px]">
                <FileUpload mutate={mutate} />
                <ConnectGoogleDrive />
            </PopoverContent>
        </Popover>
    )
}

