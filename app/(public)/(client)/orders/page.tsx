"use client"

import { Package, ShoppingBag, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import type { Order, OrderStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { dummyOrders, dummyProducts } from "@/lib/dummy-data"
import Link from "next/link"
import Image from "next/image"

// Helper to get full order with product details
const getOrdersWithProducts = (userId: string) => {
  return dummyOrders
    .filter(order => order.userId === userId)
    .map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: dummyProducts.find(p => p.id === item.productId)
      }))
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Status badge configuration
const getStatusConfig = (status: OrderStatus) => {
  const configs = {
    PENDING: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      label: "Pending"
    },
    CONFIRMED: {
      icon: Package,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Confirmed"
    },
    PROCESSING: {
      icon: Package,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Processing"
    },
    SHIPPED: {
      icon: Truck,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Shipped"
    },
    DELIVERED: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 border-green-200",
      label: "Delivered"
    },
    CANCELLED: {
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Cancelled"
    }
  }
  return configs[status] || configs.PENDING
}

export default function OrdersPage() {
  const { user, mounted } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (mounted && user) {
      // Simulate API call
      setTimeout(() => {
        const userOrders = getOrdersWithProducts(user.id)
        setOrders(userOrders)
        setLoading(false)
      }, 500)
    }
  }, [user, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-slate-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">No orders yet</h1>
              <p className="text-slate-600 mb-8 text-lg">
                Start shopping and your orders will appear here!
              </p>
              <Link href="/products">
                <Button size="lg" className="px-8">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
          <p className="text-slate-600">Track and manage your orders</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                <p className="text-xs text-slate-600">Total Orders</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => o.status === "DELIVERED").length}
                </p>
                <p className="text-xs text-slate-600">Delivered</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => o.status === "SHIPPED").length}
                </p>
                <p className="text-xs text-slate-600">In Transit</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => o.status === "PENDING" || o.status === "CONFIRMED").length}
                </p>
                <p className="text-xs text-slate-600">Processing</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon

            return (
              <Card key={order.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Order Number</p>
                        <p className="font-bold text-slate-900">#{order.id}</p>
                      </div>
                      <div className="h-8 w-px bg-slate-300" />
                      <div>
                        <p className="text-sm text-slate-600">Order Date</p>
                        <p className="font-medium text-slate-900">
                          {order.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-300" />
                      <div>
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="font-bold text-blue-600">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusConfig.color} border flex items-center gap-1.5 px-3 py-1.5`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 mb-1">
                            {item.product?.name || "Product"}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Quantity: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Shipping Address</p>
                      <p className="text-sm font-medium text-slate-900">{order.shippingAddress}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Payment: {order.paymentMethod === "STRIPE" ? "Card Payment" : "Cash on Delivery"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "DELIVERED" && (
                        <Button size="sm">
                          Order Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}