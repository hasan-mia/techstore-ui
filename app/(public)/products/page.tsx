"use client"

import { Suspense, useState, useMemo } from "react"
import { dummyCategories } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, Grid3x3, LayoutGrid, Loader2 } from "lucide-react"
import { useProducts } from "@/api/product"
import { useCategories } from "@/api/category"

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const searchQuery = searchParams.get("search") || ""

  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [gridView, setGridView] = useState<"3" | "4">("3")
  const [page, setPage] = useState(1)
  const limit = 12

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { data: catData, isLoading: catLoading, isFetching, error: catError } = useCategories();

  // Fetch products using the API hook
  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    search: searchQuery || undefined,
    category_id: categoryId || undefined,
    min_price: priceRange.min > 0 ? priceRange.min : undefined,
    max_price: priceRange.max < 2000 ? priceRange.max : undefined,
    sortBy,
    sortOrder,
  })

  // Client-side rating filter (since backend doesn't support it)
  const filtered = useMemo(() => {
    if (!data || !data?.products) return []

    let result = [...data.products]

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter((p) =>
        selectedRatings.some((rating) => Number(p.rating) >= rating && Number(p.rating) < rating + 1)
      )
    }

    return result
  }, [data?.products, selectedRatings])

  // ✅ NOW SAFE TO DO CONDITIONAL RETURNS AFTER ALL HOOKS
  if (catLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (catError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 py-3 px-6 rounded-lg text-center text-red-600">
          Failed to load categories
        </div>
      </div>
    );
  }

  if (!catData?.categories || catData.categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No categories available</p>
        </div>
      </div>
    );
  }

  const selectedCategory = categoryId ? catData?.categories?.find((c) => c?.id === categoryId) : null

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    )
  }

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 2000 })
    setSortBy("created_at")
    setSortOrder("DESC")
    setSelectedRatings([])
    setPage(1)
  }

  const clearSearch = () => {
    window.history.pushState({}, '', `/products${categoryId ? `?category=${categoryId}` : ''}`)
    window.location.reload()
  }

  const hasActiveFilters = priceRange.max !== 2000 || selectedRatings.length > 0 || searchQuery

  const handleSortChange = (value: string) => {
    switch (value) {
      case "newest":
        setSortBy("created_at")
        setSortOrder("DESC")
        break
      case "price-low":
        setSortBy("price")
        setSortOrder("ASC")
        break
      case "price-high":
        setSortBy("price")
        setSortOrder("DESC")
        break
      case "rating":
        setSortBy("rating")
        setSortOrder("DESC")
        break
      case "popular":
        setSortBy("reviews")
        setSortOrder("DESC")
        break
    }
    setPage(1)
  }

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
                  <X className="w-3 h-3 cursor-pointer" onClick={clearSearch} />
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
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"} space-y-6`}>
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
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value.split('-')[0])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="created_at">Newest First</option>
                    <option value="reviews">Most Popular</option>
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
                      onChange={(e) => {
                        setPriceRange((prev) => ({ ...prev, max: Number.parseInt(e.target.value) }))
                        setPage(1)
                      }}
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
                      <label key={rating} className="flex items-center gap-2 cursor-pointer group">
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
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Products</h3>
                  <p className="text-slate-600 mb-6">{error?.message || "Something went wrong"}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 ${gridView === "3" ? "lg:grid-cols-3" : "lg:grid-cols-4"
                    } gap-6`}
                >
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination && data?.pagination?.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-slate-600">
                      Page {page} of {data?.pagination?.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(data?.pagination?.totalPages, p + 1))}
                      disabled={page === data?.pagination?.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
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
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}