import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
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

function PerItem({
  children,
  form,
  state,
  index,
  item,
  product,
}: Readonly<{
  children: React.ReactNode
  form: any
  state: any
  index: any
  item: any
  product: any
}>) {
  const [open, setOpen] = useState<boolean>()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-bold">
            {item?.name}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <div className="space-y-2">
            <Label>Qty.</Label>
            <Input
              value={item?.quantity}
              type="number"
              onChange={(e) => {
                {
                  const quantity = parseInt(e.target.value)
                  form.setFieldValue(`items.${index}.quantity`, quantity)
                  form.setFieldValue(
                    `items.${index}.price`,
                    product.currentPrice * quantity
                  )
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Disc. (%)</Label>
            <Input
              value={item?.discount || 0}
              type="number"
              onChange={(e) => {
                const discount = parseFloat(e.target.value)
                form.setFieldValue(`items.${index}.discount`, discount)
                form.setFieldValue(
                  `items.${index}.price`,
                  product.currentPrice * item.quantity * (1 - discount / 100)
                )
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <InputGroup>
              <InputGroupAddon>₱</InputGroupAddon>
              <InputGroupInput
                value={parseFloat(item?.price || 0).toFixed(2)}
                type="number"
                readOnly
              />
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

export default PerItem
