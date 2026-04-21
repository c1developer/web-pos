import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useQuery } from "@apollo/client/react"
import { XIcon } from "@phosphor-icons/react"
import { format } from "date-fns"
import gql from "graphql-tag"
import AdjustCreditDialog from "./adjust-credit"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

type Props = {
  _id?: string
}

const GET_CUSTOMER = gql`
  query CustomerReport($_id: ID!) {
    customerReport(_id: $_id) {
      _id
      name
      email
      storeCredit {
        current
        history {
          remaining
          transacted
          date
          description
        }
      }
      createdAt
    }
  }
`

export default function StoreCreditDrawer({ _id }: Props) {
  const [open, setOpen] = useState(false)
  const { data }: any = useQuery(GET_CUSTOMER, {
    variables: {
      _id,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !_id || !open,
  })
  const customer = data?.customerReport

  return (
    <Drawer direction="right" modal open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-destructive hover:bg-destructive/80">
          Store Credit
        </Button>
      </DrawerTrigger>
      <DrawerContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="lg:min-w-xl"
      >
        <DrawerHeader className="flex flex-row justify-between">
          <div>
            <DrawerTitle>Store Credit</DrawerTitle>
            <DrawerDescription>
              Current store credit of <span>{customer?.name}</span>
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" size="icon-lg" className="h-full">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex h-full w-full flex-col gap-2 px-4">
          <div className="flex flex-col gap-1.5 border p-2">
            <Label>Current Store Credit</Label>
            <span className="block text-lg font-medium">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(data?.customerReport?.storeCredit?.current || 0)}
            </span>
          </div>
          <div className="h-[70vh] w-full overflow-y-auto border">
            {customer?.storeCredit?.history.length === 0 ? (
              <span>No history available</span>
            ) : (
              customer?.storeCredit?.history.map(
                (entry: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 border-b p-2"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(entry.transacted)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(Number(entry.date), "PP hh:mm aa")}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {entry.description}
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </div>
        <DrawerFooter className="flex flex-row">
          <AdjustCreditDialog _id={_id!} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
