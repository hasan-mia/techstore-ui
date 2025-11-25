"use client"

import { Suspense, useState, useMemo } from "react"
import { dummyProducts, dummyCategories } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, Grid3x3, LayoutGrid } from "lucide-react"

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const searchQuery = searchParams.get("search") || ""

  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })
  const [sortBy, setSortBy] = useState("newest")
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [gridView, setGridView] = useState<"3" | "4">("3")

  const filtered = useMemo(() => {
    let result = [...dummyProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId)
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter((p) => selectedRatings.some((rating) => p.rating >= rating && p.rating < rating + 1))
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.reviews - a.reviews)
    }

    return result
  }, [categoryId, searchQuery, priceRange, sortBy, selectedRatings])

  const selectedCategory = categoryId ? dummyCategories.find((c) => c.id === categoryId) : null

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    )
  }

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 2000 })
    setSortBy("newest")
    setSelectedRatings([])
  }

  const clearSearch = () => {
    window.history.pushState({}, '', `/products${categoryId ? `?category=${categoryId}` : ''}`)
    window.location.reload()
  }

  const hasActiveFilters = priceRange.max !== 2000 || selectedRatings.length > 0 || searchQuery

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? selectedCategory.name : "All Products"}
              </h1>
              <p className="text-slate-600">
                {searchQuery ? `Found ${filtered.length} ${filtered.length === 1 ? "product" : "products"}` :
                  `Discover ${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
                {selectedCategory && !searchQuery && ` in ${selectedCategory.name}`}
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                <Button
                  variant={gridView === "3" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridView("3")}
                  className="h-8 px-3"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridView === "4" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridView("4")}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {selectedRatings.length + (priceRange.max !== 2000 ? 1 : 0) + (searchQuery ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Active Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-2">
                  Search: "{searchQuery}"
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={clearSearch}
                  />
                </Badge>
              )}
              {priceRange.max !== 2000 && (
                <Badge variant="secondary" className="gap-2">
                  Price: ${priceRange.min} - ${priceRange.max}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setPriceRange({ min: 0, max: 2000 })}
                  />
                </Badge>
              )}
              {selectedRatings.map((rating) => (
                <Badge key={rating} variant="secondary" className="gap-2">
                  {rating}+ Stars
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleRating(rating)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"
              } space-y-6`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 h-auto p-0"
                  >
                    Reset
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({ ...prev, max: Number.parseInt(e.target.value) }))
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">${priceRange.min}</span>
                      <span className="font-medium text-slate-900">${priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Customer Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => toggleRating(rating)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-1 text-sm text-slate-700 group-hover:text-slate-900">
                          {rating}
                          <span className="text-amber-400">★</span>
                          <span className="text-slate-500">& up</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                {!categoryId && (
                  <div>
                    <label className="text-sm font-semibold text-slate-900 mb-3 block">
                      Categories
                    </label>
                    <div className="space-y-2">
                      {dummyCategories.map((cat) => (
                        <a
                          key={cat.id}
                          href={`/products?category=${cat.id}`}
                          className="block text-sm text-slate-700 hover:text-blue-600 hover:underline"
                        >
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filtered.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${gridView === "3" ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  } gap-6`}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try different keywords or adjust your filters.`
                      : "Try adjusting your filters or search criteria"}
                  </p>
                  <Button onClick={() => { resetFilters(); if (searchQuery) clearSearch(); }} variant="outline">
                    Reset {searchQuery ? 'All' : 'Filters'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}