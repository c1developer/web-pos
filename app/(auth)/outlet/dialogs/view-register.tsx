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
import RegisterFormDialog from "./register-form"

type Props = {
  _id: string
  children: React.ReactNode
}

const GET_REGISTER = gql`
  query Register($_id: ID!) {
    register(_id: $_id) {
      _id
      name
      isActive
      createdAt
      updatedAt
    }
  }
`

export default function ViewRegisterDialog({ _id, children }: Props) {
  const [open, setOpen] = useState(false)
  const { data }: any = useQuery(GET_REGISTER, {
    variables: {
      _id,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    skip: !_id || !open,
  })

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>View Register</DialogTitle>
          <DialogDescription>Details of the register.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <div>
            <Label>Name</Label>
            <span className="block text-muted-foreground">
              {data?.register?.name}
            </span>
          </div>
          <div>
            <Label>Created Date</Label>
            <span className="block text-muted-foreground">
              {data?.register?.createdAt
                ? format(Number(data.register.createdAt), "PPpp")
                : "-"}
            </span>
          </div>
          <div>
            <Label>Updated Date</Label>
            <span className="block text-muted-foreground">
              {data?.register?.updatedAt
                ? format(Number(data.register.updatedAt), "PPpp")
                : "-"}
            </span>
          </div>
        </div>
        <DialogFooter>
          <RegisterFormDialog _id={_id} />
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
