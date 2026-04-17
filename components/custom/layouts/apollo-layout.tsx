"use client"
import { ApolloProvider } from "@apollo/client/react"
import { SessionProvider } from "next-auth/react"
import React from "react"
import { client } from "@/lib/apollo"

function ApolloLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  )
}

export default ApolloLayout
