import { Textarea } from "@/components/ui/textarea"
import { Quote } from "./quote";
import type { Message } from "@/lib/client/types";
import { DataDialog } from "./data-dialog";
import { ModelSwitcher } from "./model-switcher";

export const Input = ({ id, parent, parentId, setParentId, handleFormSubmit, handleInputChange, input }: { id: string, parent?: Message, parentId?: string, setParentId: (parentId: string) => void, handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void, handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, input: string }) => {


    return (
        <div className="fixed bottom-0 z-1 rounded-lg p-2 lg:w-[calc(100%-24px)] sm:w-[500px] w-[350px] max-w-3xl mb-1 flex flex-col gap-2">
            <div className="bg-background border border-input rounded-lg">
                {parentId && parent && <Quote parent={parent} setParentId={setParentId} />}
                <form onSubmit={handleFormSubmit}>
                    <Textarea
                        className="w-full resize-none h-[72px]"
                        value={input}
                        placeholder="Ask anything"
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.shiftKey === false) {
                                e.preventDefault();
                                //@ts-expect-error convert to form element
                                (e.target.form as HTMLFormElement).requestSubmit();
                            }
                        }}
                    />
                </form>
                <div className="flex h-[32px] px-3 gap-1">
                    <ModelSwitcher />
                    <DataDialog id={id} />
                </div>
            </div>
        </div>
    )
}