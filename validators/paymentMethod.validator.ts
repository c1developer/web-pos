import z from "zod"
import Brand from "../models/brand.model"
import { Types } from "mongoose"
import { PaymentType } from "@/types/paymentMethod.type"

export const paymentMethodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().nonoptional("Name is required"),
  type: z
    .enum(Object.values(PaymentType), "Invalid payment type")
    .nonoptional("Type is required"),
})
