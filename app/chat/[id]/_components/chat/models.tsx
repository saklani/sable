"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GetUserPreferences } from "@/lib/client/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import * as React from "react"

const openaiModels = [
  {
    value: "gpt-4o-mini",
    label: "GPT-4o-mini",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o",
  },
  {
    value: "gpt-o1-mini",
    label: "GPT-o1-mini",
  },
]


export function SwitchModels() {
  const { data: response } = useQuery<GetUserPreferences>({ queryKey: ["preferences"], queryFn: () => fetch("/api/user/preferences").then(res => res.json()) })

  if (!response?.data) {
    return <></>
  }
  return <ModelComboBox defaultModel={response?.data.defaultModel} />
}

const ModelComboBox = React.memo(function ({ defaultModel }: { defaultModel: string }) {
  const { mutate } = useMutation({
    mutationKey: ["preference"],
    mutationFn: (defaultModel: string) => fetch("/api/user/preferences", { method: "PUT", body: JSON.stringify({ defaultModel }) })
  })

  const [value, setValue] = React.useState(defaultModel)
  const handleModelChange = React.useCallback((modelValue: string) => {
    if (modelValue !== value) {
      mutate(modelValue)
      setValue(modelValue)
    }
  }, [value, mutate])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-[120px]" variant={"outline"}>
          {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-[200px]">
        <DropdownMenuLabel>Open AI</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {openaiModels.map(model =>
          <DropdownMenuItem
            key={model.value}
            className={model.value === value ? "bg-foreground/30" : ""}
            onClick={() => handleModelChange(model.value)}>
            {model.value}
          </DropdownMenuItem>)
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

ModelComboBox.displayName = "ModelComboBox"