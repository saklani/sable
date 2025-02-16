"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GetObjectsResponse } from "@/lib/client/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { File, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
    mutate: (data: { body: FormData }) => void;
    status: "idle" | "pending" | "success" | "error";
}

function FileUpload({ mutate, status }: FileUploadProps) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Add file validation
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            toast.error("File size must be less than 50MB");
            return;
        }

        const body = new FormData();
        body.append("file", file);
        mutate({ body });
    };

    return (
        <Button status={status} variant={"outline"} size={"icon"} onClick={() => {
            document.getElementById("input-file")?.click();
        }}>
            <Upload className="w-4 h-4" />
            <Input
                id="input-file"
                type="file"
                onChange={handleFileChange}
                disabled={status === "pending"}
                accept=".txt,.csv,.json,.docx,.doc,.xls,.xlsx,.ppt,.pptx"
                className="hidden"
            />
        </Button>
    );
}

function FileList({ id }: { id: string }) {
    const { data: response, isLoading } = useQuery<GetObjectsResponse>({
        queryKey: ["object-get", id],
        queryFn: () => fetch(`/api/chat/${id}/objects`).then(res => res.json())
    })

    return (
        <div className="flex flex-col items-center gap-2 h-[50vh] overflow-y-auto border p-2">
           {isLoading ? <Loader2 className="animate-spin mt-12" />
            : response?.data && response.data.length > 0 ? response.data.map((file) => (
                <div key={file.id} className="flex flex-col gap-2 w-full">
                    <p className="text-sm">{file.name}</p>
                </div>
            )) : (
                <p className="text-sm w-full">No files in Chat</p>
            )}
        </div>
    )
}

interface DataDropdownProps {
    id: string;
}

export function DataDialog({ id }: DataDropdownProps) {
    const queryClient = useQueryClient()
    const { mutate, status, } = useMutation({
        mutationKey: ["object-post", id],
        mutationFn: async ({ body }: { body: FormData }) => {
            try {
                body.append("chat-id", id);
                const objectResponse = await fetch("/api/storage/object", {
                    method: "POST",
                    body
                });

                if (!objectResponse.ok) {
                    throw new Error("Failed to upload file");
                }
                queryClient.invalidateQueries({ queryKey: ["object-get", id] })
                queryClient.invalidateQueries({ queryKey: ["chats"] })
            } catch (err) {
                toast.error("Failed to upload file");
                throw err;
            }
        }
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={status === "pending"}
                >
                    {status === "pending" ? <Loader2 className="animate-spin" /> : <File />}
                    <span className="sr-only">File options</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Files in Chat</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <FileUpload mutate={mutate} status={status} />
                {/* <ConnectGoogleDrive /> */}
                <FileList id={id} />
            </DialogContent>
        </Dialog>
    );
}

