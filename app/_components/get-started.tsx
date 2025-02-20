"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GetStarted() {
    const router = useRouter()
    const handleClick = () => router.push("/register")
    return (
        <Button onClick={handleClick}>
            Get Started
        </Button>
    )
}
