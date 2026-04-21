import { gql } from "graphql-tag"

export const paymentMethodSchema = gql`
  enum PaymentType {
    PHYSICAL
    DIGITAL
    OTHER
  }

  type PaymentMethod {
    _id: ID
    name: String
    type: PaymentType
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type PaymentMethodConnection {
    total: Int
    pages: Int
    edges: [PaymentMethodEdge]
    pageInfo: PageInfo
  }

  type PaymentMethodNode {
    _id: ID!
    name: String
    type: PaymentType
    isActive: Boolean
  }

  type PaymentMethodEdge {
    node: PaymentMethodNode
    cursor: String
  }

  input PaymentMethodInput {
    name: String
    type: PaymentType
  }

  type Query {
    paymentMethod(_id: ID!): PaymentMethod
    paymentMethodTable(
      first: Int
      after: String
      search: String
      filter: [Filter]
      sort: Sort
    ): PaymentMethodConnection
    paymentMethodOptions: [Option]
  }

  type Mutation {
    createPaymentMethod(input: PaymentMethodInput): Response
    updatePaymentMethod(_id: ID!, input: PaymentMethodInput): Response
    changePaymentMethodStatus(_id: ID!): Response
  }
`
