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

const GET_PRODUCT_TYPE = gql`
  query ProductType($_id: ID!) {
    productType(_id: $_id) {
      _id
      name
      parent {
        _id
        name
      }
      isActive
      createdAt
      updatedAt
    }
  }
`

export default function RowViewDialog({ _id, open, setOpen, onClose }: Props) {
  const { data }: any = useQuery(GET_PRODUCT_TYPE, {
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
          <DialogTitle>View Product Type</DialogTitle>
          <DialogDescription>Details of the product type.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <div>
            <Label>Name</Label>
            <span className="block text-muted-foreground">
              {data?.productType?.name}
            </span>
          </div>
          <div>
            <Label>Parent</Label>
            <span className="block text-muted-foreground">
              {data?.productType?.parent?.name || "-"}
            </span>
          </div>

          <div>
            <Label>Created Date</Label>
            <span className="block text-muted-foreground">
              {data?.productType?.createdAt
                ? format(Number(data.productType.createdAt), "PPpp")
                : "-"}
            </span>
          </div>
          <div>
            <Label>Updated Date</Label>
            <span className="block text-muted-foreground">
              {data?.productType?.updatedAt
                ? format(Number(data.productType.updatedAt), "PPpp")
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
