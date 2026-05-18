import { ISalePayment } from "@/types/sale.type"

export const checkSalesPaymentStatus = (payments: any[], saleTotal: number) => {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)

  if (totalPaid >= saleTotal) return "PAID"
  if (totalPaid > 0 && totalPaid < saleTotal) return "PARTIALLY_PAID"
  return "UNPAID"
}
