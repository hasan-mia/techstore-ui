"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { dummyOrders, dummyProducts } from "@/lib/dummy-data"
import type { Order, OrderStatus } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

// Order tracking steps
const getOrderSteps = (status: OrderStatus) => {
  const steps = [
    { label: "Order Placed", status: "PENDING", icon: Package },
    { label: "Processing", status: "PROCESSING", icon: Clock },
    { label: "Shipped", status: "SHIPPED", icon: Truck },
    { label: "Delivered", status: "DELIVERED", icon: CheckCircle },
  ]

  const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]
  const currentIndex = statusOrder.indexOf(status)

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    active: statusOrder[index] === status
  }))
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order with product details
    const foundOrder = dummyOrders.find(o => o.id === params.id)
    if (foundOrder) {
      const orderWithProducts = {
        ...foundOrder,
        items: foundOrder.items.map(item => ({
          ...item,
          product: dummyProducts.find(p => p.id === item.productId)
        }))
      }
      setOrder(orderWithProducts)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const steps = getOrderSteps(order.status)

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-slate-600">
                Placed on {order.createdAt.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Badge className={`px-4 py-2 text-sm font-semibold ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
              order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
              }`}>
              {order.status}
            </Badge>
          </div>

          {/* Order Tracking */}
          {order.status !== "CANCELLED" && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.status} className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${step.completed
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-400"
                          }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {/* Label */}
                        <p className={`text-sm font-medium text-center ${step.completed ? "text-slate-900" : "text-slate-400"
                          }`}>
                          {step.label}
                        </p>
                      </div>
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${step.completed ? "bg-blue-600" : "bg-slate-200"
                          }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                    <div className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {item.product?.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-bold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card className="bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Shipping Address</h3>
              </div>
              <p className="text-slate-700">{order.shippingAddress}</p>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Payment Method</h3>
              </div>
              <p className="text-slate-700">
                {order.paymentMethod === "STRIPE" ? "💳 Card Payment" : "💵 Cash on Delivery"}
              </p>
            </Card>

            {/* Customer Info */}
            <Card className="bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Customer</h3>
              </div>
              <p className="text-slate-700">User ID: {order.userId}</p>
            </Card>

            {/* Actions */}
            <Card className="bg-blue-50 border-blue-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
                {order.status === "DELIVERED" && (
                  <Button className="w-full">
                    Order Again
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}