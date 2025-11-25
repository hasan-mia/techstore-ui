"use client"

import { useState, useEffect } from "react"
import { dummyProducts, dummyOrders, dummyUsers } from "@/lib/dummy-data"
import { Card } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useAuthContext } from "@/contexts/auth-context"

export default function AdminDashboard() {
    const { mounted, isAdmin } = useAuthContext()
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
    })

    useEffect(() => {
        if (mounted && isAdmin) {
            const revenue = dummyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            setStats({
                totalProducts: dummyProducts.length,
                totalOrders: dummyOrders.length,
                totalRevenue: revenue,
                totalUsers: dummyUsers.length,
            })
        }
    }, [mounted, isAdmin])

    // Don't render content until auth is checked
    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const statCards = [
        {
            label: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            change: "+12%",
            changeType: "increase",
        },
        {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            change: "+8%",
            changeType: "increase",
        },
        {
            label: "Total Revenue",
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            change: "+23%",
            changeType: "increase",
        },
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-orange-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            change: "+5%",
            changeType: "increase",
        },
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-600">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label} className="bg-white border-slate-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                                    }`}>
                                    <TrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="bg-white border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                        <a href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </a>
                    </div>
                    <div className="space-y-4">
                        {dummyOrders.slice(0, 5).map((order) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Order #{order.id}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.status === "DELIVERED"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "SHIPPED"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {order.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-bold text-slate-900">{formatPrice(order.totalAmount)}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Top Products */}
                <Card className="bg-white border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Top Products</h2>
                        <a href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </a>
                    </div>
                    <div className="space-y-4">
                        {dummyProducts.slice(0, 5).map((product) => (
                            <div
                                key={product.id}
                                className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Package className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 10
                                                ? "bg-green-100 text-green-700"
                                                : product.stock > 0
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {product.stock} in stock
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                ⭐ {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-bold text-slate-900 ml-4">{formatPrice(product.price)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Low Stock Alert */}
            <Card className="bg-amber-50 border-amber-200 p-6 mt-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Low Stock Alert</h3>
                        <p className="text-sm text-amber-700">
                            {dummyProducts.filter(p => p.stock <= 5).length} products are running low on stock.{" "}
                            <a href="/admin/products" className="font-medium underline">
                                Review inventory
                            </a>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}