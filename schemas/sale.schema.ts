import { gql } from "graphql-tag"

export const saleSchema = gql`
  enum SaleStatus {
    PARTIALLY_PAID
    COMPLETED
    REFUNDED
    VOIDED
  }

  type SaleItem {
    product: Product
    snapshotName: String
    snapshotPrice: Float
    quantity: Int
    discount: Float
    price: Float
    subTotal: Float
    total: Float
  }

  type SalePayment {
    method: PaymentMethod
    amount: Float
    note: String
    date: String
  }

  type SaleStatusHistoryItem {
    status: SaleStatus
    date: String
    by: User
  }

  type Sale {
    _id: ID
    saleNumber: String
    customer: Customer
    items: [SaleItem]
    payments: [SalePayment]
    subTotal: Float
    discount: Float
    total: Float
    receivedAmount: Float
    changeAmount: Float
    netAmount: Float
    notes: String
    currentStatus: SaleStatus
    saleStatusHistory: [SaleStatusHistoryItem]
    register: Register
    by: User
    createdAt: String
    updatedAt: String
  }

  type SaleConnection {
    total: Int
    pages: Int
    edges: [SaleEdge]
    pageInfo: PageInfo
  }

  type SaleNode {
    _id: ID!
    saleNumber: String
    createdAt: String
    updatedAt: String
  }

  type SaleEdge {
    node: SaleNode
    cursor: String
  }

  input SaleItemInput {
    product: ID
    snapshotName: String
    snapshotPrice: Float
    quantity: Int
    discount: Float
    price: Float
    subTotal: Float
    total: Float
  }

  input SalePaymentInput {
    method: ID
    amount: Float
    note: String
    date: String
  }

  input SaleInput {
    customer: ID
    items: [SaleItemInput]
    payments: [SalePaymentInput]
    subTotal: Float
    discount: Float
    total: Float
    receivedAmount: Float
    changeAmount: Float
    netAmount: Float
    notes: String
    register: ID
  }

  type Query {
    sale(_id: ID!): Sale
    saleTable(
      first: Int
      after: String
      search: String
      filter: [Filter]
      sort: Sort
    ): SaleConnection
    saleOptions: [Option]
  }

  type Mutation {
    generateSale(input: SaleInput): Response
  }
`
