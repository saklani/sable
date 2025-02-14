import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Back } from "./_components/back";
import { Plan } from "./_components/plan";
import { User } from "./_components/user";
import { History } from "./_components/history";
import { DeleteAccount } from "./_components/delete-account";
import { Logout } from "@/components/logout";

export default function Page() {
    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="flex flex-col w-full h-screen p-[24px]">
                <header className="flex justify-between w-full">
                    <Back />
                    <Logout />
                </header>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex flex-col md:w-1/4 w-full gap-6">
                        <User />
                        <Plan />
                    </div>
                    <Tabs defaultValue="account" className="md:w-3/4 w-full">
                        <TabsList className="grid grid-cols-2 w-full max-w-[300px]">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <div className="flex flex-col p-[24px] gap-6">
                                {/* <Payment /> */}
                                <DeleteAccount />
                            </div>
                        </TabsContent>
                        <TabsContent value="history">
                            <div className="flex flex-col p-[24px] gap-6">
                                <History />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}