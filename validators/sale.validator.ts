import { z } from "zod"

export const saleSchema = z.object({
  customer: z.string().optional(),
  items: z.array(
    z.object({
      product: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      subTotal: z.number(),
      discount: z.number(),
      total: z.number(),
    })
  ),
  notes: z.string().optional(),
  subTotal: z.number(),
  discount: z.number(),
  total: z.number(),
  by: z.string(),
  currentStatus: z.string(),
  onAccount: z.boolean(),
})
