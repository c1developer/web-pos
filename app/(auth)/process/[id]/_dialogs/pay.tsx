import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

function Pay({
  children,
  form,
  state,
}: Readonly<{
  children: React.ReactNode
  form: any
  state: any
}>) {
  const [open, setOpen] = useState<boolean>()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-bold">
            Sale Discount
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <div className="space-y-2">
            <Label>Disc. (%)</Label>
            <Input
              value={state?.discount || 0}
              type="number"
              min={0}
              max={100}
              onChange={(e) => {
                {
                  const discount = parseInt(e.target.value)
                  const discountValue = 1 - discount / 100
                  form.setFieldValue("discount", discount)
                  form.setFieldValue("total", state.total * discountValue)
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Total</Label>
            <InputGroup>
              <InputGroupAddon>₱</InputGroupAddon>
              <InputGroupInput
                value={parseFloat(state?.total || 0).toFixed(2)}
                readOnly
                className={cn(
                  state.discount > 0 && "text-green-800",
                  "font-medium underline"
                )}
              />
              {state.discount > 0 && (
                <>
                  <InputGroupAddon
                    className="text-muted-foreground line-through"
                    align="inline-end"
                  >
                    ₱
                    {parseFloat(
                      String(state.total / (1 - state.discount / 100))
                    ).toFixed(2)}
                  </InputGroupAddon>
                </>
              )}
            </InputGroup>
          </div>
        </div>
        <SheetFooter>
          <Button type="button">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default Pay
