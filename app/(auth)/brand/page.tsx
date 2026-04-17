import { Label } from "@/components/ui/label"
import FormDialog from "./dialogs/form"
import React from "react"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-xl font-medium">Brand</Label>
        <FormDialog />
      </div>
      <div className="ga flex justify-between">
        <Input placeholder="Search..." className="max-w-lg" />
      </div>
    </div>
  )
}
