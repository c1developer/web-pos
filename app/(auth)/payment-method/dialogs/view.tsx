import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useQuery } from "@apollo/client/react"
import gql from "graphql-tag"
import React, { useState } from "react"
import { format } from "date-fns"

type Props = {
  _id: string
  onClose: () => void
}

const GET_PAYMENT_METHOD = gql`
  query PaymentMethod($_id: ID!) {
    paymentMethod(_id: $_id) {
      _id
      name
      type
      isActive
      createdAt
      updatedAt
    }
  }
`

export default function ViewDialog({ _id, onClose }: Props) {
  const [open, setOpen] = useState(false)
  const { data }: any = useQuery(GET_PAYMENT_METHOD, {
    variables: {
      _id,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    skip: !_id || !open,
  })

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>View Payment Method</DialogTitle>
          <DialogDescription>Details of the payment method.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <div>
            <Label>Name</Label>
            <span className="block text-muted-foreground">
              {data?.paymentMethod?.name}
            </span>
          </div>
          <div>
            <Label>Type</Label>
            <span className="block text-muted-foreground">
              {data?.paymentMethod?.type}
            </span>
          </div>
          <div>
            <Label>Created Date</Label>
            <span className="block text-muted-foreground">
              {data?.paymentMethod?.createdAt
                ? format(Number(data.paymentMethod.createdAt), "PPpp")
                : "-"}
            </span>
          </div>
          <div>
            <Label>Updated Date</Label>
            <span className="block text-muted-foreground">
              {data?.paymentMethod?.updatedAt
                ? format(Number(data.paymentMethod.updatedAt), "PPpp")
                : "-"}
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
