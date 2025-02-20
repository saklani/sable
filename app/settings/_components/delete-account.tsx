"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memo } from "react";

export const DeleteAccount = memo(function () {
    return (
        <div className="flex flex-col items-start gap-2">
            <h1 className="title">Danger Zone</h1>
            <p className="text-sm ml-1">Delete account and all associated data</p>
            <DeleteAlert />
        </div>
    )
})

DeleteAccount.displayName = "DeleteAccount"

const DeleteAlert = memo(function () {
    const router = useRouter()
    const { mutate } = useMutation({
        mutationFn: () => fetch("/api/user", { method: "DELETE" }),
        onSuccess: () => {
            router.replace("/")
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="mt-4 ml-1" variant={"destructive"}>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => mutate()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
})

DeleteAlert.displayName = "DeleteAlert"