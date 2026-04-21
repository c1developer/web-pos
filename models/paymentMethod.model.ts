import { model, models, Schema } from "mongoose"
import { PaymentType, type IPaymentMethod } from "../types/paymentMethod.type"

const PaymentMethod = new Schema<IPaymentMethod>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(PaymentType) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default models.Payment_Method ||
  model<IPaymentMethod>("Payment_Method", PaymentMethod)
