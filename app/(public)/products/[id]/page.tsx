"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart, AlertCircle, Minus, Plus, Package, Truck, Shield, ArrowLeft, Check, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { useParams } from "next/navigation"
import { useCartContext } from "@/contexts/cart-context"
import { useWishlistContext } from "@/contexts/wishlist-context"
import { useProduct, useProducts } from "@/api/product"

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string

  // Fetch product from API
  const { data: product, isLoading, isError, error } = useProduct(productId)

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description")
  const { addItem, isInCart, getItemQuantity } = useCartContext()
  const { isInWishlist, toggleWishlist } = useWishlistContext()
  const { toast } = useToast()

  // Fetch related products (same category)
  const { data: relatedData } = useProducts(
    {
      category_id: product?.category?.id,
      limit: 5
    },
    !!product?.category?.id
  )

  const relatedProducts = relatedData?.products?.filter(p => p.id !== productId).slice(0, 4) || []

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    )
  }

  // Error or Not Found state
  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-slate-900">
            {isError ? "Error Loading Product" : "Product Not Found"}
          </h1>
          <p className="text-slate-600 mb-8">
            {isError
              ? error?.message || "Something went wrong while loading the product"
              : "The product you're looking for doesn't exist or has been removed."
            }
          </p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const inCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)
  const maxQuantity = product.stock - cartQuantity

  const handleAddToCart = () => {
    if (product.stock === 0 || product.status === 'out_of_stock') {
      toast({
        title: "Out of stock",
        description: "This product is currently unavailable",
        variant: "destructive",
        className: "text-white",
      })
      return
    }

    if (cartQuantity + quantity > product.stock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${maxQuantity} more ${maxQuantity === 1 ? "item" : "items"} available`,
        variant: "destructive",
        className: "text-white",
      })
      return
    }

    addItem(product, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    })
  }

  const handleWishlist = () => {
    const wasInWishlist = isInWishlist(product.id)
    toggleWishlist(product.id)
    toast({
      title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: wasInWishlist
        ? `${product.name} removed from your wishlist`
        : `${product.name} added to your wishlist`,
    })
  }

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const isNewProduct = () => {
    const createdDate = new Date(product.created_at)
    const daysSinceCreated = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceCreated <= 7
  }

  // Handle images array from API
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : typeof product.images === "string" && product.images
      ? [product.images]
      : ["/placeholder.svg"]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/products?category=${product.category.id}`} className="hover:text-blue-600 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-slate-50 rounded-2xl overflow-hidden aspect-square max-w-[550px] mx-auto">
              <Image
                src={String(productImages[selectedImage]) || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />

              {/* Compact badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isNewProduct() && (
                  <Badge className="bg-blue-600 text-white border-0 text-xs">New</Badge>
                )}
                {Number(product.rating) >= 4.5 && (
                  <Badge className="bg-amber-500 text-white border-0 text-xs">Bestseller</Badge>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {product.stock} left
                  </Badge>
                )}
              </div>

              {/* Wishlist button */}
              <Button
                size="icon"
                variant="secondary"
                onClick={handleWishlist}
                className={`absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md ${isInWishlist(product.id) ? "text-red-500" : ""
                  }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 max-w-[550px] mx-auto overflow-x-auto">
                {productImages.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx
                      ? "border-blue-600 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Link href={`/products?category=${product.category.id}`}>
                <Badge variant="secondary" className="hover:bg-slate-200 transition-colors text-xs">
                  {product.category.name}
                </Badge>
              </Link>
            )}

            {/* Product Name */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(Number(product.rating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900">{product.rating}</span>
                </div>
                <button className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  ({product.reviews} reviews)
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-slate-200">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-slate-900">
                  {formatPrice(parseFloat(product.price))}
                </span>
              </div>
              {product.stock > 0 && product.status !== 'out_of_stock' ? (
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {/* Cart Info Alert */}
            {inCart && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {cartQuantity} already in your cart
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && product.status !== 'out_of_stock' && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-12 w-12 rounded-none hover:bg-slate-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value) || 1
                        setQuantity(Math.min(Math.max(1, val), maxQuantity))
                      }}
                      className="w-16 text-center border-x-2 border-slate-200 h-12 text-base font-bold focus:outline-none"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= maxQuantity}
                      className="h-12 w-12 rounded-none hover:bg-slate-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {maxQuantity < 10 && maxQuantity > 0 && (
                    <p className="text-sm text-orange-600 font-medium">
                      Only {maxQuantity} more available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || product.status === 'out_of_stock'}
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {inCart ? "Add More" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                size="lg"
                className="h-14 w-14 border-2"
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Free Shipping</div>
                  <div className="text-xs text-slate-600">Orders over $50</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">1 Year Warranty</div>
                  <div className="text-xs text-slate-600">Protected</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Easy Returns</div>
                  <div className="text-xs text-slate-600">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="bg-white border border-slate-200 mb-12">
          <div className="border-b border-slate-200">
            <div className="flex gap-8 px-6">
              {["description", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 font-semibold transition-colors relative capitalize ${activeTab === tab ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {tab}
                  {tab === "reviews" && ` (${product.reviews})`}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-slate-700 leading-relaxed mb-6">{product.description}</p>
                <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Premium build quality and materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Latest technology and specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Excellent performance and reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Backed by manufacturer warranty</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Category</span>
                    <span className="font-semibold text-slate-900">{product.category?.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Stock</span>
                    <span className="font-semibold text-slate-900">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Status</span>
                    <span className="font-semibold text-slate-900 capitalize">{product.status}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Rating</span>
                    <span className="font-semibold text-slate-900">{product.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Reviews</span>
                    <span className="font-semibold text-slate-900">{product.reviews} reviews</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Warranty</span>
                    <span className="font-semibold text-slate-900">1 Year</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-8">
                <div className="flex items-center gap-8 pb-6 border-b border-slate-200">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-900 mb-2">{product.rating}</div>
                    <div className="flex items-center justify-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(Number(product.rating))
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                            }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-slate-600">{product.reviews} reviews</div>
                  </div>
                </div>

                {/* Sample Review */}
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-900">John D.</span>
                      <span className="text-sm text-slate-500">• 2 days ago</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Excellent product! Exceeded my expectations in every way. The build quality is outstanding
                      and it works flawlessly. Highly recommended!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">You May Also Like</h2>
              {product.category && (
                <Link href={`/products?category=${product.category.id}`}>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts && relatedProducts?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}