import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import gql from "graphql-tag"
import { XIcon } from "@phosphor-icons/react"

type Props = {
  _id?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onClose?: () => void
}

const GET_SALE = gql`
  query Sale($_id: ID!) {
    sale(_id: $_id) {
      _id
      saleNumber
      subTotal
      discount
      total
      receivedAmount
      changeAmount
      netAmount
      notes
      currentSaleStatus
      isOnAccount
      createdAt
      updatedAt
      customer {
        _id
        name
        email
        isActive
        createdAt
        updatedAt
      }
      items {
        snapshotName
        snapshotPrice
        quantity
        discount
        price
        subTotal
        total
        product {
          _id
          image
          sku
          name
          barcode
          description
          currentPrice
          isActive
          createdAt
          updatedAt
        }
      }
      payments {
        amount
        change
        note
        date
        method {
          _id
          name
          type
          isActive
          createdAt
          updatedAt
        }
      }
      saleStatusHistory {
        status
        date
        by {
          _id
          image
          name
          surname
          displayName
          email
          username
          role
          pin
          isActive
          createdAt
          updatedAt
        }
      }
      register {
        _id
        name
        prefix
        isOpen
        isActive
        createdAt
        updatedAt
      }
      by {
        _id
        image
        name
        surname
        displayName
        email
        username
        role
        pin
        isActive
        createdAt
        updatedAt
      }
    }
  }
`

export default function RowViewDialog({ _id, open, setOpen, onClose }: Props) {
  const { data }: any = useQuery(GET_SALE, {
    variables: {
      _id,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !_id || !open,
  })

  const handleClose = () => {
    setOpen?.(false)
    onClose?.()
  }

  return (
    <Drawer modal open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="lg:min-w-2xl"
      >
        <DrawerHeader className="flex flex-row justify-between">
          <div>
            <DrawerTitle>Sales Order</DrawerTitle>
            <DrawerDescription>
              Details of sales order {data?.sale?.saleNumber || "-"}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="h-full">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4">
          <div className="max-h-40 overflow-y-auto bg-muted p-2">
            <div className="flex justify-between">
              <div className="-space-y-px">
                <span className="block text-left">
                  Customer:{" "}
                  <span className="text-muted-foreground">
                    {data?.sale?.customer ? data.sale.customer.name : "Walk-in"}
                  </span>
                </span>
                <span className="block text-left">
                  Sales No.:{" "}
                  <span className="text-muted-foreground">
                    {data?.sale?.saleNumber || "-"}
                  </span>
                </span>
              </div>
              <div className="-space-y-px">
                <span className="block text-right">
                  Order Date:{" "}
                  <span className="text-muted-foreground">
                    {data?.sale?.createdAt
                      ? format(Number(data.sale.createdAt), "PPpp")
                      : "-"}
                  </span>
                </span>
                <span className="block text-right">
                  User:{" "}
                  <span className="text-muted-foreground">
                    {data?.sale?.by
                      ? `${data.sale.by.name} ${data.sale.by.surname}`
                      : "-"}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto bg-muted p-2">
            {data?.sale?.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-sm p-2 hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-20 w-20 items-center justify-center bg-slate-300">
                    <span className="block text-3xl font-medium text-white">
                      {(() => {
                        const nameArray = item.snapshotName.split(" ")
                        return nameArray.length > 1
                          ? `${nameArray[0]}${nameArray[1]}`.toUpperCase()
                          : `${item.snapshotName[0]}${item.snapshotName[1] || ""}`.toUpperCase()
                      })()}
                    </span>
                  </div>
                  <div className="-space-y-px">
                    <span className="block text-lg">{item.snapshotName}</span>
                    <span className="block text-xs font-medium text-foreground">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(item.price)}{" "}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(item.snapshotPrice)}
                      </span>
                    )}
                    <span className="block text-xs text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col h-full justify-start">
                  <span className="block text-lg font-medium">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(item.total)}
                  </span>
                  {item.subTotal != item.total && (
                    <span className="block text-right text-xs text-muted-foreground line-through">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(item.subTotal)}
                    </span>
                  )}
                </div>
              </div>
            )) || <span className="text-muted-foreground">No items</span>}
          </div>
          {/* <div>
            <Label>Customer</Label>
            <span className="block text-muted-foreground">
              {data?.sale?.customer ? data.sale.customer.name : "Walk-in"}
            </span>
          </div>
          <div>
            <Label>Created Date</Label>
            <span className="block text-muted-foreground">
              {data?.sale?.createdAt
                ? format(Number(data.sale.createdAt), "PPpp")
                : "-"}
            </span>
          </div>
          <div>
            <Label>Updated Date</Label>
            <span className="block text-muted-foreground">
              {data?.sale?.updatedAt
                ? format(Number(data.sale.updatedAt), "PPpp")
                : "-"}
            </span>
          </div> */}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
