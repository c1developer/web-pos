import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { ButtonGroup } from "@/components/ui/button-group"
import { IRegister } from "@/types/register.type"
import { IPaymentMethod } from "@/types/paymentMethod.type"
import { XIcon } from "@phosphor-icons/react"

const amountShortcuts = [20, 50, 100, 200, 500, 1000]

function Pay({
  children,
  state,
  register,
  form,
}: Readonly<{
  children: React.ReactNode
  form: any
  state: any
  register: any
}>) {
  const [open, setOpen] = useState<boolean>(false)
  const subTotal = state.subTotal
  const discount = state.discount
  const total = state.total
  const numberOfItems = state.items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  )
  const paidAmount =
    total -
    state.payments.reduce(
      (acc: number, payment: { amount: number }) => acc + payment.amount,
      0
    )
  const change = paidAmount < 0 ? Math.abs(paidAmount) : 0
  const [amountTendered, setAmountTendered] = useState<number>(total)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmountTendered(total)
  }, [total])

  const paymentMethods = useMemo(
    () =>
      register?.paymentMethods.map((r: IRegister) => ({
        id: r._id,
        name: r.name,
      })),
    [register]
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
                <Label>Total</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(total)}
                </Label>
              </div>
              <Separator />
              {state.payments.length > 0 && (
                <>
                  <div className="flex justify-between gap-2">
                    <Label>Payments</Label>
                  </div>
                  {state.payments.map((payment: any, index: number) => (
                    <div className="flex justify-between gap-2" key={index}>
                      <Label>
                        <XIcon
                          className="text-destructive hover:cursor-pointer hover:underline hover:underline-offset-2"
                          onClick={() =>
                            form.setFieldValue(
                              "payments",
                              state.payments.filter(
                                (_: any, i: number) => i !== index
                              )
                            )
                          }
                        />
                        {
                          paymentMethods.find(
                            (p: IPaymentMethod) => payment._id === p._id
                          )?.name
                        }
                      </Label>
                      <Label className="text-primary">
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(payment.amount)}
                      </Label>
                    </div>
                  ))}
                  <Separator />
                </>
              )}
              <div className="flex justify-between gap-2 font-bold">
                <Label>To Pay</Label>
                <Label>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(paidAmount >= 0 ? paidAmount : 0)}
                </Label>
              </div>
              {change > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between gap-2 text-destructive">
                    <Label>Change</Label>
                    <Label className="font-medium underline">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(change)}
                    </Label>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col gap-2.5 bg-muted p-2.5">
            <Label>Amount Tendered</Label>
            <InputGroup className="h-18 bg-white">
              <InputGroupInput
                type="number"
                value={amountTendered}
                onChange={(e) => setAmountTendered(parseFloat(e.target.value))}
                className="h-full text-center md:text-5xl"
              />
            </InputGroup>
            <ButtonGroup>
              {amountShortcuts.map((amount) => {
                if (amount > amountTendered)
                  return (
                    <Button
                      variant="outline"
                      key={amount}
                      onClick={() => setAmountTendered(amount)}
                    >
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
                <Button
                  size="lg"
                  key={method._id}
                  className="p-3 text-xl"
                  onClick={() => {
                    form.setFieldValue("payments", [
                      ...state.payments,
                      {
                        method: method._id,
                        amount: amountTendered,
                        date: new Date(),
                      },
                    ])
                    setAmountTendered(0)
                  }}
                >
                  {method.name}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" form="sale-form">
            Pay
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default Pay
