import z from "zod"

export const customerSchema = z.object({
  _id: z.string().optional(),
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email address").optional().nullable(),
})
