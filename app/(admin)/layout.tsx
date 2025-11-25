"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminRoute } from "@/middleware/protectedRoute"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <AdminRoute>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}