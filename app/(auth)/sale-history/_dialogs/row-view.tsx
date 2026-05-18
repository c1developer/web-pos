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
  open?: boolean
  setOpen?: (open: boolean) => void
  onClose?: () => void
}

const GET_BRAND = gql`
  query Brand($_id: ID!) {
    brand(_id: $_id) {
      _id
      name
      isActive
      createdAt
      updatedAt
    }
  }
`

export default function RowViewDialog({ _id, open, setOpen, onClose }: Props) {
  const { data }: any = useQuery(GET_BRAND, {
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
    <Dialog modal open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>View Brand</DialogTitle>
          <DialogDescription>Details of the brand.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <div>
            <Label>Name</Label>
            <span className="block text-muted-foreground">
              {data?.brand?.name}
            </span>
          </div>

          <div>
            <Label>Created Date</Label>
            <span className="block text-muted-foreground">
              {data?.brand?.createdAt
                ? format(Number(data.brand.createdAt), "PPpp")
                : "-"}
            </span>
          </div>
          <div>
            <Label>Updated Date</Label>
            <span className="block text-muted-foreground">
              {data?.brand?.updatedAt
                ? format(Number(data.brand.updatedAt), "PPpp")
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
