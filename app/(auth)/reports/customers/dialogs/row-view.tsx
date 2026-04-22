import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useQuery } from "@apollo/client/react"
import { XIcon } from "@phosphor-icons/react"
import { format } from "date-fns"
import gql from "graphql-tag"
import AdjustCreditDialog from "./adjust-credit"
import { Separator } from "@/components/ui/separator"
import StoreCreditDrawer from "./view-credit"
import AccountLimitDrawer from "./view-limit"

type Props = {
  _id?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onClose?: () => void
}

const GET_CUSTOMER = gql`
  query CustomerReport($_id: ID!) {
    customerReport(_id: $_id) {
      _id
      name
      email
      accountLimit {
        current
        max
       
      }
      storeCredit {
        current
      }
      createdAt
    }
  }
`

export default function RowViewDrawer({ _id, open, setOpen, onClose }: Props) {
  const { data }: any = useQuery(GET_CUSTOMER, {
    variables: {
      _id,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !_id || !open,
  })
  const customer = data?.customerReport

  const handleClose = () => {
    setOpen?.(false)
    onClose?.()
  }

  return (
    <Drawer direction="right" modal open={open} onOpenChange={handleClose}>
      <DrawerContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="lg:min-w-5xl"
      >
        <DrawerHeader className="flex flex-row justify-between">
          <div>
            <DrawerTitle>{customer?.name}</DrawerTitle>
            <DrawerDescription>{customer?.email}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" size="icon-lg" className="h-full">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex h-full w-full px-4">
          <div className="grid w-xs grid-cols-2 place-content-start gap-1.5 border p-2.5">
            <div className="col-span-2">
              <Label>Email</Label>
              <span className="block text-muted-foreground">
                {customer?.email}
              </span>
            </div>
            <div className="col-span-2">
              <Label>Customer Since</Label>
              <span className="block text-muted-foreground">
                {customer?.createdAt
                  ? format(Number(customer.createdAt), "PPpp")
                  : "-"}
              </span>
            </div>
            <Separator className="col-span-2" />
            <div className="col-span-2">
              <Label>Max Account Limit</Label>
              <span className="block text-lg font-medium">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(customer?.accountLimit?.max || 0)}
              </span>
            </div>
            <div className="col-span-2">
              <Label>Remaining Account Limit</Label>
              <span className="block text-lg font-medium">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(customer?.accountLimit?.current || 0)}
              </span>
            </div>
            <div className="col-span-2">
              <Label>Store Credit</Label>
              <span className="block text-lg font-medium">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(customer?.storeCredit?.current || 0)}
              </span>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-row">
          <StoreCreditDrawer _id={_id!} />
          <AccountLimitDrawer _id={_id!} />
        
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
