"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, ShoppingCart, Eye, TrendingUp, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCartContext } from "@/contexts/cart-context"
import { useWishlistContext } from "@/contexts/wishlist-context"

interface ProductCardProps {
  product: Product
  showBestSellerBadge?: boolean
}

export function ProductCard({ product, showBestSellerBadge = false }: ProductCardProps) {
  const { addItem, isInCart, getItemQuantity } = useCartContext()
  const { isInWishlist, toggleWishlist } = useWishlistContext()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)

  const inCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  // Convert string values to numbers for calculations
  const priceNum = parseFloat(product.price)
  const ratingNum = parseFloat(product.rating)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()

    if (product.stock === 0 || product.status === 'out_of_stock') {
      toast({
        title: "Out of stock",
        description: "This product is currently unavailable",
        variant: "destructive",
        className: "text-white",
      })
      return
    }

    if (cartQuantity >= product.stock) {
      toast({
        title: "Maximum quantity reached",
        description: `You already have ${product.stock} items in your cart`,
        variant: "destructive",
        className: "text-white",
      })
      return
    }

    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    const wasInWishlist = isInWishlist(product.id)
    toggleWishlist(product.id)
    toast({
      title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: wasInWishlist
        ? `${product.name} removed from your wishlist`
        : `${product.name} added to your wishlist`,
    })
  }

  const isNewProduct = () => {
    const createdDate = new Date(product.created_at)
    const daysSinceCreated = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceCreated <= 7
  }

  const isLowStock = product.stock > 0 && product.stock <= 5
  const productImage = product.images?.[0] || "/placeholder.svg"

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className="group relative overflow-hidden bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-64 bg-slate-50 overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isNewProduct() && (
              <Badge className="bg-blue-600 text-white border-0 shadow-lg">
                New
              </Badge>
            )}
            {(showBestSellerBadge || ratingNum >= 4.5) && (
              <Badge className="bg-amber-500 text-white border-0 shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Best Seller
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="destructive" className="shadow-lg">
                Only {product.stock} left
              </Badge>
            )}
            {inCart && (
              <Badge className="bg-green-600 text-white border-0 shadow-lg flex items-center gap-1">
                <Check className="w-3 h-3" />
                In Cart ({cartQuantity})
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlist}
              className={`bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all ${isHovered ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                } ${isInWishlist(product.id) ? "text-red-500" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={`bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all delay-75 ${isHovered ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                }`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Add to Cart Overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
          >
            <Button
              onClick={handleAddToCart}
              className={`w-full ${inCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-white text-slate-900 hover:bg-slate-100"
                }`}
              disabled={product.stock === 0 || cartQuantity >= product.stock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {inCart ? `Add More (${cartQuantity} in cart)` : "Add to Cart"}
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {(product.stock === 0 || product.status === 'out_of_stock') && (
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Tag */}
          <div className="text-xs text-blue-600 font-medium mb-2">
            {product.category.name}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(ratingNum)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700">
              {product.rating}
            </span>
            <span className="text-sm text-slate-500">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <div className="text-2xl font-bold text-slate-900">
                ${priceNum.toFixed(2)}
              </div>
              {product.stock > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {product.stock} available
                </div>
              )}
            </div>

            {product.stock > 0 && (
              <Button
                size="icon"
                onClick={handleAddToCart}
                disabled={cartQuantity >= product.stock}
                className={`shadow-lg ${inCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  )
}