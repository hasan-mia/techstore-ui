"use client"

import { ProductCard } from "@/components/product-card"
import { TrendingUp } from "lucide-react"
import { Product } from "@/lib/types"
import ProductSkeleton from "../product-skeleton"
import Error from "../error"
import { useBestSellers } from "@/api/product"

interface BestSellersProps {
    limit?: number
}

export function BestSellers({ limit = 8 }: BestSellersProps) {
    const { data: products, isLoading, isFetching, error } = useBestSellers(limit)

    if (isLoading || isFetching) {
        return (
            <ProductSkeleton count={limit} />
        )
    }

    if (error) {
        return (
            <Error />
        )
    }

    if (!products || !products.data || products.data.length === 0) {
        return null
    }

    return (
        <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-amber-100 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Best Sellers</h2>
                        <p className="text-slate-600">Most popular products this month</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products && products?.data && products?.data?.map((product: Product) => (
                        <ProductCard key={product.id} product={product} showBestSellerBadge={true} />
                    ))}
                </div>
            </div>
        </section>
    )
}

