"use client"

import { useState, useCallback, useEffect } from "react"
import type { CartItem, Product } from "@/lib/types"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("cart")
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        const newQuantity = existing.quantity + quantity
        if (newQuantity > product.stock) return prev
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId))
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.productId === productId)
  }, [items])

  const getItemQuantity = useCallback((productId: string) => {
    const item = items.find((item) => item.productId === productId)
    return item?.quantity || 0
  }, [items])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    total,
    count,
    mounted,
  }
}



// // Update the disabled state to properly check form validity
// <Button
//   onClick={ handleSubmit }
// disabled = { createOrderMutation.isPending || isLoadingAddress || !isFormValid() }
// size = "lg"
// className = "w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//   >
//   {
//     createOrderMutation.isPending ? (
//       <>
//       <Loader2 className= "w-5 h-5 mr-2 animate-spin" />
//       Processing...
//     </>
//   ) : (
//       <>
//       <Lock className="w-5 h-5 mr-2" />
//     Complete Purchase({ formatPrice(finalTotal) })
//     </>
//     )}
// </Button>

// ==================== 4. Update Types (if needed) ====================
// File: lib/types.ts

