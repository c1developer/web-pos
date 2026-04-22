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
import { useQuery } from "@apollo/client/react"
import { format } from "date-fns"
import gql from "graphql-tag"

type Props = {
  _id?: string
  customerId?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onClose?: () => void
}

const GET_CREDIT_ITEM = gql`
  query customerCreditHistoryItemById($customerId: ID!, $itemId: ID!) {
    customerCreditHistoryItemById(customerId: $customerId, itemId: $itemId) {
      _id
      description
      date
      transacted
      remaining
    }
  }
`

export default function RowViewCreditHistoryItemDialog({
  _id: itemId,
  customerId,
  open,
  setOpen,
  onClose,
}: Props) {
  const { data, error }: any = useQuery(GET_CREDIT_ITEM, {
    variables: {
      customerId,
      itemId,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !itemId || !open,
  })
  const item = data?.customerCreditHistoryItemById

  const handleClose = () => {
    setOpen?.(false)
    onClose?.()
  }

  return (
    <Dialog modal open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>View Credit Item</DialogTitle>
          <DialogDescription>Details of the credit item.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <div>
            <Label>Transacted Amount</Label>
            <span
              className={
                item?.transacted < 0 ? "text-destructive" : "text-green-700"
              }
            >
              {item?.transacted > 0 && `+`}
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(item?.transacted ?? 0)}
            </span>
          </div>
          <div>
            <Label>Remaining Amount</Label>
            <span>
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(item?.remaining ?? 0)}
            </span>
          </div>
          <div>
            <Label>Description</Label>
            <span className="block text-muted-foreground">
              {item?.description || "-"}
            </span>
          </div>
          <div>
            <Label>Date Transacted</Label>
            <span className="block text-muted-foreground">
              {item?.date ? format(Number(item.date), "PPpp") : "-"}
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
