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
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { ButtonGroup } from "@/components/ui/button-group"

const amountShortcuts = [20, 50, 100, 200, 500, 1000]

function Pay({
  children,
  state,
  register,
}: Readonly<{
  children: React.ReactNode
  form: any
  state: any
  register: any
}>) {
  const [open, setOpen] = useState<boolean>()
  const subTotal = state.subTotal
  const discount = state.discount
  const total = state.total
  const numberOfItems = state.items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="lg:min-w-275">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold">
            Sale Summary
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full gap-2.5 px-4">
          <div className="flex max-w-80 flex-1 gap-4">
            <div className="flex h-full w-full flex-col gap-2 bg-muted p-2.5">
              <div className="flex justify-between gap-2">
                <Label>Subtotal</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(subTotal)}
                </Label>
              </div>
              <div className="flex justify-between gap-2">
                <Label>Discount</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(discount)}
                </Label>
              </div>
              <div className="flex justify-between gap-2">
                <Label>Items</Label>
                <Label>{numberOfItems}</Label>
              </div>
              <Separator />
              <div className="flex justify-between gap-2">
                <Label>Sale Total</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(total)}
                </Label>
              </div>
              <Separator />
              <div className="flex justify-between gap-2 font-bold">
                <Label>To Pay</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(total)}
                </Label>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col gap-2.5 bg-muted p-2.5">
            <Label>Amount Tendered</Label>
            <InputGroup className="h-18 bg-white">
              <InputGroupInput
                type="number"
                defaultValue={parseFloat(total).toFixed(2)}
                className="h-full text-center md:text-5xl"
              />
            </InputGroup>
            <ButtonGroup>
              {amountShortcuts.map((amount) => {
                if (amount > total)
                  return (
                    <Button variant="outline" key={amount}>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(amount)}
                    </Button>
                  )
              })}
            </ButtonGroup>
            <ButtonGroup>
              {register?.paymentMethods?.map((method: any) => (
                <Button size="lg" key={method._id} className="p-3 text-xl">
                  {method.name}
                </Button>
              ))}
            </ButtonGroup>
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
