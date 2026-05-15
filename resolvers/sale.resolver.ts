import { GraphQLError } from "graphql"
import Sale from "../models/sale.model"
import { startOfDay, endOfDay } from "date-fns"
import { Types, type PipelineStage } from "mongoose"
import type { IDataTableArgs } from "../types/shared.type"
import { fromCursor, toCursor } from "../helpers/cursor"
import { flatten } from "../helpers/flatten"
import { checkSchema, validate } from "../helpers/validate"
import { saleSchema } from "../validators/sale.validator"
import { isISOString } from "../helpers/isoString"
import Register from "@/models/register.model"

const CURSOR_TYPE = "sale"

export const saleResolver = {
  Query: {
    sale: async (_: any, { _id }: any) => {
      try {
        const sale = await Sale.findById(_id).lean()
        if (!sale) throw new GraphQLError("Sale not found")
        return sale
      } catch (error) {
        throw error
      }
    },
    saleTable: async (
      _: any,
      { first = 10, after, search, filter, sort }: IDataTableArgs
    ) => {
      try {
        const matchStage: Record<string, any> = {}

        if (search)
          matchStage.$or = [{ name: { $regex: search, $options: "i" } }]

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
        const total = await Sale.countDocuments(matchStage)

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

        const result = await Sale.aggregate(pipeline)
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
    saleOptions: async () => {
      try {
        const sales = await Sale.find({ isActive: true })
          .select("_id name")
          .lean()
        if (!sales || sales.length === 0)
          throw new GraphQLError("No sales found.")
        return sales.map((sale) => ({
          value: sale._id,
          label: sale.name,
        }))
      } catch (error) {
        throw error
      }
    },
  },
  Mutation: {
    generateSale: async (_: any, { input }: any, ctx: any) => {
      try {
        if (!ctx.session)
          throw new GraphQLError("Unauthorized", {
            extensions: { code: "UNAUTHORIZED" },
          })
        const register = await Register.findById(input.register)
          .select("prefix")
          .lean()
        const sales = await Sale.find({
          register: input.register,
        })
          .sort({ createdAt: -1 })
          .select("saleNumber")
          .lean()
        const count = sales.length
        const newSale = flatten({
          ...input,
          saleNumber: `${register?.prefix || "REG"}-${String(count + 1).padStart(5, "0")}`,
          currentStatus: "COMPLETED",
          salesStatusHistory: [
            {
              status: "COMPLETED",
              date: new Date(),
              by: ctx.session._id,
            },
          ],
          by: ctx.session._id,
        })
        const result = await Sale.create(newSale)
        return {
          ok: true,
          message: "Sale created successfully.",
          data: result,
        }
      } catch (error) {
        throw error
      }
    },
  },
}
