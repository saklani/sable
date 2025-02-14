import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ProviderDataGoogle } from "@/components/google-data";
import { ProviderLogin } from "@/components/login-provider";
export default async function LoginPage() {
    return (
        <div className="flex w-full h-screen justify-center items-center p-[24px]">
            <Card className="flex flex-col items-stretch w-full max-w-[360px] justify-between">
            <CardHeader className="mt-[16px] items-center">
                <h1 className="subtitle">Login</h1>
                <h2 className="muted">Sign in to your account</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 items-stretch py-6">
                <ProviderLogin provider="google">
                    <ProviderDataGoogle />
                </ProviderLogin>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="info">Don&apos;t have an account? <Link className="text-blue-700 hover:underline" href="/register">Register</Link></p>
            </CardFooter>
        </Card>
        </div>
    );
}