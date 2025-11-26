"use client"

import { useCallback, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogin, useRegister, useUserInfo } from "@/api/auth"
import { useQueryClient } from "@tanstack/react-query"

export function useAuth() {
  const { token, user, setToken, setUser, logout: clearAuth } = useAuthStore()
  const queryClient = useQueryClient()

  // Fetch user info when token exists
  const { data: userInfo, isLoading, refetch } = useUserInfo(!!token)

  // Update user in store when fetched
  useEffect(() => {
    if (userInfo) {
      setUser({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        role: userInfo.role,
        avatar: userInfo.avatar,
        phone: userInfo.phone,
        address: userInfo.address,
        createdAt: new Date(userInfo.created_at),
      })
    }
  }, [userInfo, setUser])

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password })

      if (result?.token) {
        setToken(result.token)
        // Refetch user info after successful login
        await refetch()
        return { success: true, user: userInfo }
      }

      return { success: false, error: "No token received" }
    } catch (error: any) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error?.message || "Login failed"
      }
    }
  }, [loginMutation, setToken, refetch, userInfo])

  const register = useCallback(async (data: {
    email: string
    password: string
    name: string
  }) => {
    try {


      const result = await registerMutation.mutateAsync(data)

      if (result?.token) {
        setToken(result.token)
        // Refetch user info after successful registration
        await refetch()
        return { success: true, user: userInfo }
      }

      return { success: false, error: "No token received" }
    } catch (error: any) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: error?.message || "Registration failed"
      }
    }
  }, [registerMutation, setToken, refetch, userInfo])

  const logout = useCallback(() => {
    clearAuth()
    queryClient.clear()
    // Clear other local storage items
    localStorage.removeItem("cart")
    localStorage.removeItem("wishlist")
  }, [clearAuth, queryClient])

  const updateUser = useCallback((updates: Partial<typeof user>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }, [user, setUser])

  // Role-based checks
  const isAdmin = user?.role === "ADMIN"
  const isUser = user?.role === "USER"
  const isAuthenticated = !!token && !!user

  // Role-based permissions
  const hasPermission = useCallback((requiredRole: "USER" | "ADMIN") => {
    if (!user) return false
    if (requiredRole === "USER") return true
    return user.role === "ADMIN"
  }, [user])

  const canAccessAdminPanel = isAdmin
  const canManageProducts = isAdmin
  const canManageOrders = isAdmin
  const canManageUsers = isAdmin
  const canViewAnalytics = isAdmin

  return {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isUser,
    hasPermission,
    canAccessAdminPanel,
    canManageProducts,
    canManageOrders,
    canManageUsers,
    canViewAnalytics,
    mounted: true,
    loading: isLoading || loginMutation.isPending || registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}