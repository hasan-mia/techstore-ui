"use client"

import type React from "react"
import { ProtectedRoute } from "@/middleware/protectedRoute"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
