"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRegisterStore } from "@/hooks/use-register"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import {
  CaretDownIcon,
  CheckIcon,
  GraduationCapIcon,
  PlusCircleIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { IOption } from "@/types/shared.type"
import { IProduct } from "@/types/product.type"
import z from "zod"
import { useForm } from "@tanstack/react-form"
import { Field } from "@/components/ui/field"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { saleSchema } from "@/validators/sale.validator"
import AddCustomer from "./_dialogs/add-customer"
import PerItem from "./_dialogs/per-item"

const GET_REGISTER = gql`
  query ProcessedRegister($_id: ID!) {
    processedRegister(_id: $_id) {
      _id
      name
      prefix
      outlet {
        _id
        name
      }
      products {
        _id
        image
        sku
        name
        barcode
        description
        currentPrice

        type {
          _id
          name
        }
      }
      productTypes {
        _id
        name
      }
    }
  }
`

const FETCH_LATEST_SALE_NUMBER = gql`
  query FetchLatestSaleNumber($_id: ID!) {
    latestSaleNumber(_id: $_id)
  }
`

function DiscardDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="text-destructive">
          Discard
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard Sale?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            transaction and its content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600">
            Yes, Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Page() {
  const [isPending, startTransition] = useTransition()
  const params = useParams()
  const { setRegister } = useRegisterStore()
  const { data } = useQuery(GET_REGISTER, {
    variables: { _id: params.id },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
  })
  const register = (data as any)?.processedRegister || null
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>("")

  useEffect(() => {
    if (register && register.productTypes.length > 0)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedType(register.productTypes[0]._id)
  }, [register])

  const [openSearchCommand, setOpenSearchCommand] = useState(false)

  const TEST_SALE_NUMBER = `${register?.prefix}-0000001`

  const form = useForm({
    defaultValues: {
      customer: "",
      items: [] as any,
    },
    validators: {
      onSubmit: ({ formApi, value }: any) => {
        try {
          saleSchema.parse(value)
        } catch (error: any) {
          JSON.parse(error).map(({ path, message }: any) => {
            const pathName = path.join(".")
            formApi.fieldInfo[pathName].instance?.setErrorMap({
              onSubmit: { message },
            })
          })
        }
      },
    },
    onSubmit: ({ value }: any) =>
      startTransition(() => {
        try {
          const payload = {
            name: value.name,
          }
          console.log(value)
        } catch (error: any) {
          throw error
        }
      }),
  })

  return (
    <form
      id="register-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex h-full w-full"
    >
      <form.Subscribe
        selector={(state) => state.values}
        children={(state) => (
          <>
            <div className="flex-1 flex-col space-y-1.5 bg-muted p-2.5">
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink>{register?.outlet?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          router.push("/process")
                          setRegister("")
                        }}
                      >
                        {register?.name || params.id}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex">
                <Popover
                  open={openSearchCommand}
                  onOpenChange={setOpenSearchCommand}
                >
                  <PopoverTrigger asChild>
                    <ButtonGroup className="w-full bg-white">
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSearchCommand}
                        className={cn(
                          "font-base flex-1 justify-between border-r-transparent bg-white text-muted-foreground capitalize hover:bg-transparent hover:text-muted-foreground"
                        )}
                        type="button"
                      >
                        Search SKU, Barcode / Product Name
                      </Button>
                    </ButtonGroup>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search products" />
                      <CommandList>
                        <CommandEmpty>No option/s found.</CommandEmpty>
                        <CommandGroup>
                          {register?.products?.map((product: IProduct) => (
                            <CommandItem
                              key={product._id.toString()}
                              value={product._id.toString()}
                              // onSelect={(val) => {
                              //   form.setFieldValue("items", [
                              //     ...form.getFieldValue("items"),
                              //     {},
                              //   ])
                              // }}
                            >
                              <span className="block">{product.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <ButtonGroup>
                  <Button
                    variant="outline"
                    disabled
                    size="icon"
                    className="font-base"
                  >
                    <GraduationCapIcon />
                  </Button>
                  <Button variant="outline" disabled className="font-base">
                    Gift Card
                  </Button>
                  <Button variant="outline" disabled className="font-base">
                    Custom Sale
                  </Button>
                </ButtonGroup>
              </div>
              <ButtonGroup>
                {register?.productTypes.map((type: any, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "font-base cursor-pointer",
                      selectedType === type._id &&
                        "bg-blue-400 text-primary-foreground hover:bg-blue-400/80 hover:text-white"
                    )}
                    onClick={() => setSelectedType(type._id)}
                  >
                    {type.name}
                  </Button>
                ))}
              </ButtonGroup>
              <form.Field name="customer">
                {(field: any) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <>
                      <Field data-invalid={isInvalid}>
                        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                          {register?.products
                            .filter((p: any) => selectedType === p.type._id)
                            .map((product: any) => (
                              <div
                                key={product._id}
                                className="flex h-45 flex-col border hover:cursor-pointer hover:drop-shadow"
                                onClick={() =>
                                  form.setFieldValue(
                                    "items",
                                    (() => {
                                      const currentItems =
                                        form.getFieldValue("items")
                                      const existingItem = currentItems.find(
                                        (item: any) =>
                                          product._id === item.product
                                      )
                                      if (existingItem) {
                                        return currentItems.map((item: any) => {
                                          if (
                                            existingItem.product ===
                                            item.product
                                          ) {
                                            const newQty = item.quantity + 1
                                            return {
                                              ...item,
                                              quantity: newQty,
                                              price:
                                                product.currentPrice * newQty,
                                            }
                                          } else return item
                                        })
                                      }

                                      return [
                                        ...form.getFieldValue("items"),
                                        {
                                          product: product._id,
                                          quantity: 1,
                                          name: product.name,
                                          price: product.currentPrice,
                                          subTotal: product.currentPrice,
                                          discount: 0,
                                          total: product.currentPrice,
                                        },
                                      ]
                                    })()
                                  )
                                }
                              >
                                <div className="flex flex-1 items-center justify-center bg-slate-200">
                                  <span className="text-6xl font-semibold text-muted uppercase">
                                    {(() => {
                                      const image = product.image?.[0]
                                      if (image)
                                        return (
                                          <Image
                                            src={image}
                                            alt={product.name}
                                            className="h-16 w-16 object-cover"
                                          />
                                        )
                                      const nameArray = product.name.split(" ")
                                      if (nameArray.length > 1)
                                        return `${nameArray[0][0]}`
                                      else
                                        return `${product.name[0]}${product.name[1]}`
                                    })()}
                                  </span>
                                </div>
                                <div className="bg-white">
                                  <span className="block text-center text-sm font-medium">
                                    {product.name}
                                  </span>
                                  <span className="block text-center text-[0.65rem] text-muted-foreground">
                                    {new Intl.NumberFormat("en-PH", {
                                      style: "currency",
                                      currency: "PHP",
                                    }).format(product.currentPrice)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </Field>
                    </>
                  )
                }}
              </form.Field>
            </div>
            <div className="flex w-96 flex-col justify-between gap-2.5 p-2">
              <AddCustomer form={form} />
              <div className="flex flex-1 flex-col items-start justify-start overflow-y-auto">
                {state.items.length > 0 && (
                  <div className="flex max-h-96 w-full flex-col gap-2.5">
                    {state.items.map((item: any, index: number) => {
                      const product = register?.products.find(
                        (p: any) => p._id === item.product
                      )
                      return (
                        <PerItem
                          form={form}
                          state={state}
                          item={item}
                          product={product}
                          index={index}
                          key={index}
                        >
                          <div
                            key={index}
                            className="relative flex items-start justify-start border"
                          >
                            <div className="absolute flex h-5.5 w-5.5 items-center justify-center rounded-full bg-primary">
                              <span className="block text-sm text-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center bg-slate-200">
                              <span className="text-3xl font-semibold text-muted uppercase">
                                {(() => {
                                  const nameArray = item.name.split(" ")
                                  if (nameArray.length > 1)
                                    return `${nameArray[0][0]}`
                                  else return `${item.name[0]}${item.name[1]}`
                                })()}
                              </span>
                            </div>
                            <div className="flex flex-1 items-start justify-between p-2">
                              <span className="block text-sm">{item.name}</span>
                              <div className="text-right">
                                <span className="block text-sm font-medium">
                                  {new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                  }).format(item.price)}
                                </span>
                                {item.discount > 0 && (
                                  <>
                                    <span className="block text-sm text-muted-foreground line-through">
                                      {new Intl.NumberFormat("en-PH", {
                                        style: "currency",
                                        currency: "PHP",
                                      }).format(
                                        product.currentPrice * item.quantity
                                      )}
                                    </span>
                                    <span className="text-xs block text-muted-foreground">
                                      
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              className="h-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                              size="icon-sm"
                              onClick={() => {
                                form.setFieldValue(
                                  "items",
                                  form
                                    .getFieldValue("items")
                                    .filter((_: any, i: number) => i !== index)
                                )
                              }}
                            >
                              <TrashSimpleIcon />
                            </Button>
                          </div>
                        </PerItem>
                      )
                    })}
                  </div>
                )}
              </div>
              <div>
                <div>
                  <Accordion
                    type="multiple"
                    className="list-none"
                    defaultValue={["summary"]}
                  >
                    <AccordionItem value="notes">
                      <AccordionTrigger className="text-primary hover:underline-offset-2">
                        Notes
                      </AccordionTrigger>
                      <AccordionContent className="h-fit px-2.5">
                        <Textarea placeholder="Add notes for this sale" />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="summary"
                      className="border-b border-dashed"
                    >
                      <AccordionTrigger className="text-primary hover:underline-offset-2">
                        Summary
                      </AccordionTrigger>
                      <AccordionContent className="h-fit px-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span>
                              {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(0)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <span>
                              {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(0)}
                            </span>
                          </div>
                          {/* <Separator />
                          <div className="flex items-center justify-between">
                            <span>Tax</span>
                            <span>
                              {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(0)}
                            </span>
                          </div> */}
                          <Separator />
                          <div className="flex items-center justify-between font-semibold">
                            <span>Total (Items: 1)</span>
                            <span>
                              {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(0)}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <DiscardDialog />
                  <Button
                    className="flex h-fit w-full justify-between p-3.5 text-xl"
                    size="lg"
                  >
                    <span>Pay</span>
                    <span>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(0)}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      />
    </form>
  )
}
