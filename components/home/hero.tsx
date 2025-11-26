"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroSlides } from "@/lib/dummy-data"
import { useRouter } from "next/navigation"


export function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="relative h-[600px] overflow-hidden bg-slate-900">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
            ? "opacity-100 translate-x-0"
            : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
            }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`} />

          {/* Background Image with Overlay */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4">
            <div className="flex items-center h-full">
              <div className="max-w-2xl text-white space-y-6">
                {/* Badge */}
                <div className="inline-block">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    {slide.badge}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-2xl md:text-3xl font-medium opacity-90">
                  {slide.subtitle}
                </p>

                {/* Description */}
                <p className="text-lg md:text-xl opacity-80 max-w-xl">
                  {slide.description}
                </p>

                {/* Price */}
                <div className="text-3xl font-bold">
                  {slide.price}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link href={slide.category_id ? `/products?category=${slide.category_id}` : `/products/${slide.product_id}`}>
                    <Button
                      size="lg"
                      className="bg-white text-slate-900 hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl"
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => router.push(`/products/${slide.product_id}`)}
                    size="lg"
                    variant="outline"
                    className="border-2 bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {/* Product Image (Right Side) */}
              <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96">
                <div className="relative w-full h-full animate-float">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10 border border-white/30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10 border border-white/30"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${index === currentSlide
              ? "w-12 bg-white"
              : "w-3 bg-white/50 hover:bg-white/70"
              } h-3 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: isAutoPlaying ? "100%" : "0%",
            animation: isAutoPlaying ? "progress 5s linear" : "none"
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}