import { GraphQLError } from "graphql"
import Customer from "../models/customer.model"
import { startOfDay, endOfDay } from "date-fns"
import { Types, type PipelineStage } from "mongoose"
import type { IDataTableArgs } from "../types/shared.type"
import { fromCursor, toCursor } from "../helpers/cursor"
import { flatten } from "../helpers/flatten"
import { checkSchema, validate } from "../helpers/validate"
import { customerSchema } from "../validators/customer.validator"
import { isISOString } from "../helpers/isoString"

const CURSOR_TYPE = "customer"

export const customerResolver = {
  Query: {
    customer: async (_: any, { _id }: any) => {
      try {
        const customer = await Customer.findById(_id)
          .select("_id name email isActive createdAt updatedAt")
          .lean()
        if (!customer) throw new GraphQLError("Customer not found")
        return customer
      } catch (error) {
        throw error
      }
    },
    customerReport: async (_: any, { _id }: any) => {
      try {
        const customer = await Customer.findById(_id)
          .select("_id name email accountLimit storeCredit createdAt")
          .lean()
        if (!customer) throw new GraphQLError("Customer not found")
        return customer
      } catch (error) {
        throw error
      }
    },
    customerTable: async (
      _: any,
      { first = 10, after, search, filter, sort }: IDataTableArgs
    ) => {
      try {
        const matchStage: Record<string, any> = {}

        if (search)
          matchStage.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ]

        if (filter && filter.length > 0)
          matchStage.$and = filter.map(({ type, key, value }) => {
            switch (type) {
              case "TEXT":
              case "SELECT":
                return { [key]: { $regex: value, $options: "i" } }
              case "NUMBER":
                return { [key]: Number(value) }
              case "DATE":
                const [start, end] = value
                  .split("_")
                  .map((date) => new Date(date))
                if (!start || !end) return null
                return {
                  [key]: {
                    $gte: startOfDay(start),
                    $lte: endOfDay(end),
                  },
                }
              case "BOOLEAN":
                return { [key]: value === "true" }
              default:
                return null
            }
          })

        const sortKey = sort?.key || "_id"
        const sortOrder = sort?.order === "ASC" ? 1 : -1
        const total = await Customer.countDocuments(matchStage)

        if (after) {
          const { id, type, value } = fromCursor(after)
          if (type !== CURSOR_TYPE) throw new Error("Invalid cursor")
          const cursorId = new Types.ObjectId(id)
          const cursorValue = isISOString(value) ? new Date(value) : value

          matchStage.$and = [
            ...(matchStage.$and || []),
            {
              $or: [
                {
                  [sortKey]:
                    sortOrder === 1
                      ? { $gt: cursorValue }
                      : { $lt: cursorValue },
                },
                {
                  [sortKey]: cursorValue,
                  _id: sortOrder === 1 ? { $gt: cursorId } : { $lt: cursorId },
                },
              ],
            },
          ]
        }

        const pipeline: PipelineStage[] = [
          { $match: matchStage },
          {
            $sort: { [sortKey]: sortOrder, _id: sortOrder },
          },
          { $limit: first + 1 },
          {
            $project: {
              name: 1,
              isActive: 1,
            },
          },
        ]

        const result = await Customer.aggregate(pipeline)
        const sliced = result.slice(0, first)
        const edges = sliced.map((edge) => ({
          node: edge,
          cursor: toCursor({
            type: CURSOR_TYPE,
            id: edge._id.toString(),
            value: edge[sortKey],
          }),
        }))

        return {
          total,
          pages: Math.ceil(total / first),
          edges,
          pageInfo: {
            endCursor: sliced.length
              ? toCursor({
                  id: sliced[sliced.length - 1]._id.toString(),
                  type: CURSOR_TYPE,
                  value: sliced[sliced.length - 1][sortKey],
                })
              : null,
            hasNextPage: result.length > first,
          },
        }
      } catch (error) {
        throw error
      }
    },
    customerReportTable: async (
      _: any,
      { first = 10, after, search, filter, sort }: IDataTableArgs
    ) => {
      try {
        const matchStage: Record<string, any> = {}

        if (search)
          matchStage.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ]

        if (filter && filter.length > 0)
          matchStage.$and = filter.map(({ type, key, value }) => {
            switch (type) {
              case "TEXT":
              case "SELECT":
                return { [key]: { $regex: value, $options: "i" } }
              case "NUMBER":
                return { [key]: Number(value) }
              case "DATE":
                const [start, end] = value
                  .split("_")
                  .map((date) => new Date(date))
                if (!start || !end) return null
                return {
                  [key]: {
                    $gte: startOfDay(start),
                    $lte: endOfDay(end),
                  },
                }
              case "BOOLEAN":
                return { [key]: value === "true" }
              default:
                return null
            }
          })

        const sortKey = sort?.key || "_id"
        const sortOrder = sort?.order === "ASC" ? 1 : -1
        const total = await Customer.countDocuments(matchStage)

        if (after) {
          const { id, type, value } = fromCursor(after)
          if (type !== CURSOR_TYPE) throw new Error("Invalid cursor")
          const cursorId = new Types.ObjectId(id)
          const cursorValue = isISOString(value) ? new Date(value) : value

          matchStage.$and = [
            ...(matchStage.$and || []),
            {
              $or: [
                {
                  [sortKey]:
                    sortOrder === 1
                      ? { $gt: cursorValue }
                      : { $lt: cursorValue },
                },
                {
                  [sortKey]: cursorValue,
                  _id: sortOrder === 1 ? { $gt: cursorId } : { $lt: cursorId },
                },
              ],
            },
          ]
        }

        const pipeline: PipelineStage[] = [
          { $match: matchStage },
          {
            $sort: { [sortKey]: sortOrder, _id: sortOrder },
          },
          { $limit: first + 1 },
          {
            $project: {
              name: 1,
              remainingAccountLimit: "$accountLimit.current",
              remainingStoreCredit: "$storeCredit.current",
              isActive: 1,
            },
          },
        ]

        const result = await Customer.aggregate(pipeline)
        const sliced = result.slice(0, first)
        const edges = sliced.map((edge) => ({
          node: edge,
          cursor: toCursor({
            type: CURSOR_TYPE,
            id: edge._id.toString(),
            value: edge[sortKey],
          }),
        }))

        return {
          total,
          pages: Math.ceil(total / first),
          edges,
          pageInfo: {
            endCursor: sliced.length
              ? toCursor({
                  id: sliced[sliced.length - 1]._id.toString(),
                  type: CURSOR_TYPE,
                  value: sliced[sliced.length - 1][sortKey],
                })
              : null,
            hasNextPage: result.length > first,
          },
        }
      } catch (error) {
        throw error
      }
    },
    customerOptions: async () => {
      try {
        const customers = await Customer.find({ isActive: true })
          .select("_id name")
          .lean()
        if (!customers || customers.length === 0)
          throw new GraphQLError("No customers found.")
        return customers.map((customer) => ({
          value: customer._id,
          label: customer.name,
        }))
      } catch (error) {
        throw error
      }
    },
  },
  Mutation: {
    createCustomer: validate(checkSchema(customerSchema))(
      async (_: any, { input }: any) => {
        try {
          const initialLimitsAndCredits = {
            accountLimit: { max: 0, current: 0, history: [] },
            storeCredit: { current: 0, history: [] },
          }
          const result = await Customer.create({
            ...input,
            ...initialLimitsAndCredits,
          })
          return {
            ok: true,
            message: "Customer created successfully.",
            data: result,
          }
        } catch (error) {
          throw error
        }
      }
    ),
    adjustAccountLimit: async (_: any, { _id, amount }: any) => {
      try {
        const customer = await Customer.findById(_id)
          .select("accountLimit")
          .lean()
        if (!customer) throw new GraphQLError("Customer not found")
        const result = await Customer.findByIdAndUpdate(
          _id,
          {
            $inc: { "accountLimit.current": amount },
            $push: {
              "accountLimit.history": {
                remaining: customer.accountLimit.current + amount,
                transacted: amount,
                date: new Date(),
              },
            },
          },
          { returnDocument: "after" }
        ).lean()
        if (!result) throw new GraphQLError("Customer not found")
        return {
          ok: true,
          message: "Account limit adjusted successfully.",
          data: result,
        }
      } catch (error) {
        throw error
      }
    },
    adjustStoreCredit: async (_: any, { _id, amount, description }: any) => {
      try {
        const customer = await Customer.findById(_id)
          .select("storeCredit")
          .lean()
        if (!customer) throw new GraphQLError("Customer not found")
        const result = await Customer.findByIdAndUpdate(
          _id,
          {
            $inc: { "storeCredit.current": amount },
            $push: {
              "storeCredit.history": {
                remaining: customer.storeCredit.current + amount,
                transacted: amount,
                date: new Date(),
                description: description || "",
              },
            },
          },
          { returnDocument: "after" }
        ).lean()
        if (!result) throw new GraphQLError("Customer not found")
        return {
          ok: true,
          message: "Store credit adjusted successfully.",
          data: result,
        }
      } catch (error) {
        throw error
      }
    },
    updateCustomer: validate(checkSchema(customerSchema))(
      async (_: any, { _id, input }: any) => {
        try {
          const result = await Customer.findByIdAndUpdate(_id, flatten(input), {
            returnDocument: "after",
          }).lean()
          if (!result) throw new GraphQLError("Customer not found")
          return {
            ok: true,
            message: "Customer updated successfully.",
            data: result,
          }
        } catch (error) {
          throw error
        }
      }
    ),
    changeCustomerStatus: async (_: any, { _id }: any) => {
      try {
        const customer = await Customer.findById(_id).select("isActive").lean()
        if (!customer) throw new GraphQLError("Customer not found")
        const result = await Customer.findByIdAndUpdate(
          _id,
          {
            isActive: !customer.isActive,
          },
          {
            returnDocument: "after",
          }
        ).lean()
        if (!result) throw new GraphQLError("Customer not found")

        return {
          ok: true,
          message: "Customer status updated successfully.",
          data: result,
        }
      } catch (error) {
        throw error
      }
    },
  },
}
