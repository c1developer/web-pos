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
import { cn } from "@/lib/utils"

function PerItem({
  children,
  form,
  state,
  index,
  product,
}: Readonly<{
  children: React.ReactNode
  form: any
  state: any
  index: any
  product: any
}>) {
  const [open, setOpen] = useState<boolean>()
  const item = state.items[index]
  const [discountType, setDiscountType] = useState<"%" | "₱">("₱")

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
                  form.setFieldValue(`items`, () => {
                    const itemPrice = product.currentPrice - item.discount
                    const itemTotal = quantity * itemPrice
                    return state.items.map((i: any, idx: number) => {
                      if (idx === index) {
                        return {
                          ...i,
                          quantity,
                          subTotal: quantity * product.currentPrice,
                          price: itemPrice,
                          total: itemTotal,
                        }
                      } else return i
                    })
                  })
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Discount  {discountType === "%" ? "(%)" : "per item (₱)"}
              <span
                className="text-primary hover:cursor-pointer hover:underline hover:underline-offset-2"
                onClick={() =>
                  setDiscountType(discountType === "%" ? "₱" : "%")
                }
              >
                {discountType === "%"
                  ? "Change to fixed amount"
                  : "Change to percent"}
              </span>
            </Label>
            {discountType === "%" && (
              <InputGroup>
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
                <InputGroupInput
                  value={parseFloat(
                    ((item?.discount / product.currentPrice) * 100).toFixed(2)
                  )}
                  type="number"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    {
                      const discount = parseFloat(e.target.value || "0")
                      form.setFieldValue(`items`, () => {
                        const discountAmount = (
                          (discount / 100) *
                          product.currentPrice
                        ).toFixed(2)
                        const itemPrice = product.currentPrice - +discountAmount
                        const itemTotal = item.quantity * itemPrice
                        return state.items.map((i: any, idx: number) => {
                          if (idx === index) {
                            return {
                              ...i,
                              discount: discountAmount,
                              price: itemPrice,
                              total: itemTotal,
                            }
                          } else return i
                        })
                      })
                    }
                  }}
                />
              </InputGroup>
            )}
            <InputGroup>
              <InputGroupAddon>₱</InputGroupAddon>
              <InputGroupInput
                value={item?.discount || 0}
                type="number"
                min={0}
                max={product.currentPrice}
                readOnly={discountType === "%"}
                onChange={(e) => {
                  {
                    const discount = parseFloat(e.target.value)
                    form.setFieldValue(`items`, () => {
                      const itemPrice = product.currentPrice - discount
                      const itemTotal = item.quantity * itemPrice
                      return state.items.map((i: any, idx: number) => {
                        if (idx === index) {
                          return {
                            ...i,
                            discount,
                            price: itemPrice,
                            total: itemTotal,
                          }
                        } else return i
                      })
                    })
                  }
                }}
              />
            </InputGroup>
          </div>
          <div className="space-y-2">
            <Label>{item.discount > 0 ? "Discounted Price" : "Price"}</Label>
            <InputGroup>
              <InputGroupAddon>₱</InputGroupAddon>
              <InputGroupInput
                value={parseFloat(item?.price || 0).toFixed(2)}
                className={cn(
                  item.discount > 0 && "text-blue-800",
                  "font-medium"
                )}
                readOnly
              />
              {item.discount > 0 && (
                <>
                  <InputGroupAddon
                    className="text-muted-foreground line-through"
                    align="inline-end"
                  >
                    ₱{parseFloat(product.currentPrice).toFixed(2)}
                  </InputGroupAddon>
                </>
              )}
            </InputGroup>
          </div>
          <div className="space-y-2">
            <Label>Total</Label>
            <InputGroup>
              <InputGroupAddon>₱</InputGroupAddon>
              <InputGroupInput
                value={parseFloat(item?.total || 0).toFixed(2)}
                readOnly
                className={cn(
                  item.discount > 0 && "text-green-800",
                  "font-medium underline"
                )}
              />
              {item.discount > 0 && (
                <>
                  <InputGroupAddon
                    className="text-muted-foreground line-through"
                    align="inline-end"
                  >
                    ₱
                    {parseFloat(
                      String(product.currentPrice * parseInt(item.quantity))
                    ).toFixed(2)}
                  </InputGroupAddon>
                </>
              )}
            </InputGroup>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default PerItem
