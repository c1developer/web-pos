import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.GRAPHQL_URI }),
  cache: new InMemoryCache({
    typePolicies: {
      Brand: {
        keyFields: ["_id"],
      },
      User: {
        keyFields: ["_id"],
      },
      Outlet: {
        keyFields: ["_id"],
      },
      Register: {
        keyFields: ["_id"],
      },
      ProductType: {
        keyFields: ["_id"],
      },
      Product: {
        keyFields: ["_id"],
      },
      Customer: {
        keyFields: ["_id"],
      },
    },
  }),
})
