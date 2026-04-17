"use client"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PlusCircleIcon } from "@phosphor-icons/react"
import { useState, useTransition } from "react"
import { useForm } from "@tanstack/react-form"
import z from "zod"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { useMutation } from "@apollo/client/react"
import gql from "graphql-tag"
import { toast } from "sonner"
import { brandSchema } from "@/validators/brand.validator"

const CREATE_BRAND = gql`
  mutation CreateBrand($input: BrandInput!) {
    createBrand(input: $input) {
      ok
      message
    }
  }
`

export default function Form() {
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const [createBrand] = useMutation(CREATE_BRAND)

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: ({ formApi, value }: any) => {
        try {
          brandSchema.parse(value)
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
      startTransition(async () => {
        try {
          const result: any = await createBrand({
            variables: {
              input: {
                name: value.name,
              },
            },
          })
          if (result.data.createBrand.ok) {
            setOpen(false)
            toast.success(result.data.createBrand.message)
            form.reset()
          }
        } catch (error: any) {
          console.error(error)
          throw error
        }
      }),
  })

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild>
        <Button>
          Add Brand <PlusCircleIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Brand Form</SheetTitle>
          <SheetDescription>
            Make changes to your brand here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <form
            id="brand-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldSet className="">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <InputGroup className="-my-1">
                        <InputGroupInput
                          placeholder="Name"
                          disabled={isPending}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      </InputGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
            </FieldSet>
          </form>
        </div>
        <SheetFooter>
          <Button type="submit" form="brand-form" disabled={isPending}>
            Submit
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
