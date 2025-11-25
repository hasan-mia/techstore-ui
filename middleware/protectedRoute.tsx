"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"

// Protected Route Wrapper - Requires Authentication
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading, mounted } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted && !isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, loading, mounted, router])

    if (loading || !mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

// Admin Only Route - Requires ADMIN role
export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, loading, mounted } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted) {
            if (!user) {
                router.push("/login")
            } else if (!isAdmin) {
                router.push("/") // Redirect non-admins to home
            }
        }
    }, [user, isAdmin, loading, mounted, router])

    if (loading || !mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user || !isAdmin) {
        return null
    }

    return <>{children}</>
}
