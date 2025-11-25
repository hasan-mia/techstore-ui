"use client"

import { useState, useEffect } from "react"
import { dummyProducts } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { Flame, Clock, TrendingDown, Zap, Gift, Tag, Percent } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate deals from products (add discounts to existing products)
const generateDeals = () => {
  return dummyProducts.map(product => {
    const discountPercent = Math.floor(Math.random() * 50) + 10 // 10-60% off
    const originalPrice = product.price
    const discountedPrice = Math.floor(originalPrice * (1 - discountPercent / 100))
    const savings = originalPrice - discountedPrice

    // Determine deal type
    const dealTypes = ["flash", "daily", "clearance", "bundle"]
    const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)]

    return {
      ...product,
      originalPrice,
      price: discountedPrice,
      discountPercent,
      savings,
      dealType,
      stockLeft: Math.floor(Math.random() * 10) + 1,
      endsIn: Date.now() + (Math.random() * 86400000 * 3) // Ends in 0-3 days
    }
  })
}

// Countdown timer hook
const useCountdown = (targetDate: number) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

function CountdownTimer({ endsIn }: any) {
  const timeLeft = useCountdown(endsIn)

  return (
    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4" />
      <div className="flex gap-1 text-sm font-bold">
        <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  )
}

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDeals(generateDeals())
  }, [])

  const filteredDeals = filter === "all"
    ? deals
    : deals.filter(deal => deal.dealType === filter)

  const dealCategories = [
    { id: "all", label: "All Deals", icon: Tag, color: "text-blue-600" },
    { id: "flash", label: "Flash Sales", icon: Zap, color: "text-yellow-600" },
    { id: "daily", label: "Daily Deals", icon: Flame, color: "text-red-600" },
    { id: "clearance", label: "Clearance", icon: TrendingDown, color: "text-green-600" },
    { id: "bundle", label: "Bundles", icon: Gift, color: "text-purple-600" },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold">Hot Deals</h1>
            <Flame className="w-12 h-12 animate-pulse" />
          </div>
          <p className="text-center text-xl mb-8 opacity-90">
            Save big on your favorite products! Limited time offers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge className="bg-white text-red-600 px-4 py-2 text-lg font-bold">
              Up to 60% OFF
            </Badge>
            <Badge className="bg-yellow-400 text-slate-900 px-4 py-2 text-lg font-bold">
              Free Shipping
            </Badge>
            <Badge className="bg-white text-red-600 px-4 py-2 text-lg font-bold">
              Limited Stock
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mega Deal Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 fill-yellow-400 text-yellow-400 animate-pulse" />
              <h2 className="text-3xl font-bold">⚡ Flash Sale - Ends Soon!</h2>
            </div>
            <p className="text-xl mb-6 opacity-90">
              Lightning deals that won't last long. Grab them before they're gone!
            </p>
            <div className="flex items-center gap-4">
              <CountdownTimer endsIn={Date.now() + 3600000} />
              <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100">
                Shop Flash Sales
              </Button>
            </div>
          </div>
        </Card>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter by Deal Type</h3>
          <div className="flex flex-wrap gap-3">
            {dealCategories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={filter === category.id ? "default" : "outline"}
                  onClick={() => setFilter(category.id)}
                  className={`${filter === category.id ? "" : "bg-white"}`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${filter === category.id ? "" : category.color}`} />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white p-6 text-center">
            <Percent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">{deals.length}</p>
            <p className="text-sm text-slate-600">Active Deals</p>
          </Card>
          <Card className="bg-white p-6 text-center">
            <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">45%</p>
            <p className="text-sm text-slate-600">Avg. Discount</p>
          </Card>
          <Card className="bg-white p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">24h</p>
            <p className="text-sm text-slate-600">Limited Time</p>
          </Card>
          <Card className="bg-white p-6 text-center">
            <Flame className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">Hot</p>
            <p className="text-sm text-slate-600">Best Offers</p>
          </Card>
        </div>

        {/* Deals Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {filter === "all" ? "All Deals" : dealCategories.find(c => c.id === filter)?.label}
            </h2>
            <p className="text-slate-600">
              {filteredDeals.length} {filteredDeals.length === 1 ? "deal" : "deals"} found
            </p>
          </div>

          {filteredDeals.length === 0 ? (
            <Card className="bg-white p-12 text-center">
              <Tag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No deals found</h3>
              <p className="text-slate-600 mb-6">Try changing your filter to see more deals.</p>
              <Button onClick={() => setFilter("all")}>View All Deals</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Deal Badge */}
                  <div className="absolute -top-2 -right-2 z-20">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{deal.discountPercent}%
                    </div>
                  </div>

                  {/* Countdown Badge */}
                  <div className="absolute top-2 left-2 z-20">
                    <CountdownTimer endsIn={deal.endsIn} />
                  </div>

                  {/* Stock Warning */}
                  {deal.stockLeft <= 3 && (
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <Badge className="w-full justify-center bg-amber-500 text-white border-0 animate-pulse">
                        Only {deal.stockLeft} left!
                      </Badge>
                    </div>
                  )}

                  <ProductCard product={deal} />

                  {/* Original Price Display */}
                  <div className="absolute top-[280px] left-4 right-4 z-10">
                    <div className="bg-white bg-opacity-95 rounded-lg p-2 shadow-lg border border-slate-200">
                      <p className="text-xs text-slate-600">Original Price</p>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 line-through text-sm">
                          ${deal.originalPrice}
                        </span>
                        <span className="text-green-600 font-bold text-sm">
                          Save ${deal.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-xl mb-6 opacity-90">
            New deals added daily. Check back often for the best offers.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
            <Flame className="w-5 h-5 mr-2" />
            View All Products
          </Button>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}