import type { Types } from "mongoose"
import type { ICustomer } from "./customer.type"
import type { IUser } from "./user.type"
import type { IPayment } from "./payment.type"
import type { IProduct } from "./product.type"

export enum SaleStatus {
  PARTIALLY_PAID = "PARTIALLY_PAID",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
  VOIDED = "VOIDED",
}

export interface ISaleItem {
  product: IProduct | Types.ObjectId | string
  snapshotName: string
  snapshotPrice: number
  quantity: number
  discount: number
  price: number
  subTotal: number
  total: number
}

export interface ISalePayment {
  method: IPayment | Types.ObjectId | string
  amount: number
  note?: string
  date: string
  payment?: Types.ObjectId | string
}

export interface ISaleStatusHistoryItem {
  status: SaleStatus
  date: string
  by: IUser | Types.ObjectId | string
}

export interface ISale {
  _id: Types.ObjectId
  saleNumber: string
  customer: ICustomer | null | Types.ObjectId | string
  items: ISaleItem[]
  payments: ISalePayment[]
  subTotal: number
  discount: number
  total: number
  receivedAmount: number
  changeAmount: number
  netAmount: number
  notes: string
  currentStatus: SaleStatus
  register?: Types.ObjectId | string
  saleStatusHistory: ISaleStatusHistoryItem[]
  by: IUser | Types.ObjectId | string
}
