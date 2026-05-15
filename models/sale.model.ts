import { model, models, Schema } from "mongoose"
import {
  SaleStatus,
  type ISalePayment,
  type ISale,
  type ISaleItem,
  ISaleStatusHistoryItem,
} from "../types/sale.type"

const SaleItem = new Schema<ISaleItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    snapshotName: { type: String, required: true },
    snapshotPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
)

const SalePayment = new Schema<ISalePayment>(
  {
    method: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  { _id: false }
)

const SaleStatusHistoryItem = new Schema<ISaleStatusHistoryItem>(
  {
    status: {
      type: String,
      enum: Object.values(SaleStatus),
      required: true,
    },
    date: { type: Date, required: true },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
)

const Sale = new Schema<ISale>(
  {
    saleNumber: { type: String, required: true, unique: true },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
      default: null,
      set: (value: any) => (value === "" ? null : value),
    },
    items: {
      type: [SaleItem],
      required: true,
      default: [],
    },
    payments: {
      type: [SalePayment],
      required: true,
      default: [],
    },
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    receivedAmount: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    notes: { type: String },
    currentStatus: {
      type: String,
      enum: Object.values(SaleStatus),
      required: true,
    },
    saleStatusHistory: {
      type: [SaleStatusHistoryItem],
      default: [],
    },
    register: { type: Schema.Types.ObjectId, ref: "Register", required: true },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

export default models.Sale || model<ISale>("Sale", Sale)
