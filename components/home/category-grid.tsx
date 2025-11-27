"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useCategories } from "@/api/category"
import { Spinner } from "../ui/spinner"

export function CategoryGrid() {
  const { data, isLoading, isFetching, error } = useCategories()

  const categories = data?.categories ?? []

  if (isLoading || isFetching) {
    return (
      <Spinner />
    )
  }

  if (error || categories.length === 0) {
    return (
      <div className="py-20 flex justify-center items-center">
        <p className="text-red-600 text-lg">Failed to load categories.</p>
      </div>
    )
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our wide range of premium electronics and find exactly what you need
          </p>
        </div>

        {/* Horizontal Scrollable Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative min-w-[220px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <Image
                  src={category.icon || "/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-slate-200 text-sm mb-2 opacity-90">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
