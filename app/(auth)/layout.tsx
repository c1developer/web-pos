import Header from "@/components/custom/header"
import AppSidebar from "@/components/custom/app-sidebar"
import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  )
}
