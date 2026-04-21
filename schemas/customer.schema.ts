import { gql } from "graphql-tag"

export const customerSchema = gql`
  type AccountLimitHistoryItem {
    remaining: Float
    transacted: Float
    date: String
  }

  type AccountLimit {
    max: Float
    current: Float
    history: [AccountLimitHistoryItem]
  }

  type StoreCreditHistoryItem {
    remaining: Float
    transacted: Float
    date: String
    description: String
  }

  type StoreCredit {
    current: Float
    history: [StoreCreditHistoryItem]
  }

  type Customer {
    _id: ID
    name: String
    email: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type CustomerReport {
    _id: ID
    name: String
    email: String
    accountLimit: AccountLimit
    storeCredit: StoreCredit
    createdAt: String
  }

  # Customer Table
  type CustomerConnection {
    total: Int
    pages: Int
    edges: [CustomerEdge]
    pageInfo: PageInfo
  }

  type CustomerNode {
    _id: ID!
    name: String
    isActive: Boolean
  }

  type CustomerEdge {
    node: CustomerNode
    cursor: String
  }

  # Customer Report Table
  type CustomerReportConnection {
    total: Int
    pages: Int
    edges: [CustomerReportEdge]
    pageInfo: PageInfo
  }

  type CustomerReportNode {
    _id: ID!
    name: String
    remainingAccountLimit: Float
    remainingStoreCredit: Float
    isActive: Boolean
  }

  type CustomerReportEdge {
    node: CustomerReportNode
    cursor: String
  }

  # Inputs
  input CustomerInput {
    name: String
    email: String
  }

  type Query {
    customer(_id: ID!): Customer
    customerReport(_id: ID!): CustomerReport
    customerTable(
      first: Int
      after: String
      search: String
      filter: [Filter]
      sort: Sort
    ): CustomerConnection
    customerReportTable(
      first: Int
      after: String
      search: String
      filter: [Filter]
      sort: Sort
    ): CustomerReportConnection
    customerOptions: [Option]
  }

  type Mutation {
    createCustomer(input: CustomerInput): Response
    adjustAccountLimit(_id: ID!, amount: Float!): Response
    adjustStoreCredit(_id: ID!, amount: Float!, description: String): Response
    updateCustomer(_id: ID!, input: CustomerInput): Response
    changeCustomerStatus(_id: ID!): Response
  }
`
