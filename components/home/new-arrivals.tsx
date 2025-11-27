"use client"

import { ProductCard } from "@/components/product-card"
import { Sparkles } from "lucide-react"
import { useNewArrivals } from "@/api/product"
import { Product } from "@/lib/types"
import Error from "../error"
import ProductSkeleton from "../product-skeleton"

interface NewArrivalsProps {
    limit?: number
}

export function NewArrivals({ limit = 8 }: NewArrivalsProps) {
    const { data: products, isLoading, isFetching, error } = useNewArrivals(limit)

    if (isLoading || isFetching) {
        return (
            <ProductSkeleton count={limit} />
        )
    }

    if (error || !products) {
        return (
            <Error />
        )
    }

    if (!products || !products.data || products.data.length === 0) {
        return null
    }

    return (
        <section className="py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">New Arrivals</h2>
                        <p className="text-slate-600">Fresh products just for you</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products && products.data && products.data.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}