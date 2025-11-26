import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturesSection } from "@/components/home/features-section"
import { BestSellers } from "@/components/home/best -sellers"
import { NewArrivals } from "@/components/home/new-arrivals"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <Hero />

      {/* Features */}
      <FeaturesSection />

      {/* Categories */}
      <CategoryGrid />

      <BestSellers limit={9} />

      {/* New Arrivals Section */}
      <NewArrivals limit={9} />

    </div>
  )
}