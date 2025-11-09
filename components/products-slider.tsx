"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingCart, Star } from "lucide-react"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: { id: number; name: string }
  imageUrls?: string
  imageUrl?: string
  fragrance?: string
  volume?: number
  active: boolean
}

interface ProductsSliderProps {
  limit?: number
  autoSlide?: boolean
  autoSlideInterval?: number
}

export function ProductsSlider({ limit = 8, autoSlide = true, autoSlideInterval = 5000 }: ProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [productsPerSlide, setProductsPerSlide] = useState(4)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const updateProductsPerSlide = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setProductsPerSlide(4)
        } else if (window.innerWidth >= 768) {
          setProductsPerSlide(3)
        } else {
          setProductsPerSlide(2)
        }
      }
    }

    updateProductsPerSlide()
    window.addEventListener("resize", updateProductsPerSlide)
    return () => window.removeEventListener("resize", updateProductsPerSlide)
  }, [])

  useEffect(() => {
    if (autoSlide && !isPaused && products.length > 0 && productsPerSlide > 0) {
      const maxIndex = Math.max(0, products.length - productsPerSlide)
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
      }, autoSlideInterval)
      return () => clearInterval(interval)
    }
  }, [autoSlide, autoSlideInterval, isPaused, products.length, productsPerSlide])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Check cache first (client-side caching)
      const cacheKey = 'products_slider_cache'
      const cacheTime = 60000 // 1 minute
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < cacheTime) {
          const filtered = data
            .filter((p: Product) => p.active && p.stock > 0)
            .slice(0, limit)
          setProducts(filtered)
          setLoading(false)
          return
        }
      }
      
      const res = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      })
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      // Filter only active products with stock > 0 and limit the number
      const filtered = data
        .filter((p: Product) => p.active && p.stock > 0)
        .slice(0, limit)
      setProducts(filtered)
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Error fetching products:", error)
      // Try to use cached data on error
      const cacheKey = 'products_slider_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data } = JSON.parse(cached)
        const filtered = data
          .filter((p: Product) => p.active && p.stock > 0)
          .slice(0, limit)
        setProducts(filtered)
      }
    } finally {
      setLoading(false)
    }
  }, [limit])


  const getProductImage = useCallback((product: Product): string => {
    try {
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          return buildImageUrl(imageUrls[0])
        }
      }
      if (product.imageUrl) {
        return buildImageUrl(product.imageUrl)
      }
    } catch (e) {
      // Ignore
    }
    return "/placeholder.svg?height=300&width=300"
  }, [])

  const addToCart = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("chada_cart") || "[]")
    const existingItem = cart.find((item: any) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ productId, quantity: 1 })
    }
    localStorage.setItem("chada_cart", JSON.stringify(cart))
    // Trigger storage event to update cart count in header
    window.dispatchEvent(new Event("storage"))
    // Show a subtle notification
    const button = e.currentTarget as HTMLElement
    const originalText = button.innerHTML
    button.innerHTML = "✓ تمت الإضافة"
    setTimeout(() => {
      button.innerHTML = originalText
    }, 2000)
  }

  const nextSlide = () => {
    const maxIdx = Math.max(0, products.length - productsPerSlide)
    setCurrentIndex((prev) => (prev + 1) % (maxIdx + 1))
  }

  const prevSlide = () => {
    const maxIdx = Math.max(0, products.length - productsPerSlide)
    setCurrentIndex((prev) => (prev - 1 + (maxIdx + 1)) % (maxIdx + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  const maxIndex = Math.max(0, products.length - productsPerSlide)

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
            منتجاتنا المميزة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة مختارة من أفضل عطورنا الفاخرة
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {products.length > productsPerSlide && (
            <>
              <button
                onClick={prevSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label="Previous products"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
                aria-label="Next products"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div
            ref={sliderRef}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / productsPerSlide)}%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / productsPerSlide}%` }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border">
                      {/* Product Image */}
                      <div className="relative h-64 bg-secondary overflow-hidden">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                          quality={85}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Add to Cart Button - appears on hover */}
                        <button
                          onClick={(e) => addToCart(product.id, e)}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 hover:scale-105 shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          أضف للسلة
                        </button>

                        {/* Stock Badge */}
                        {product.stock < 10 && (
                          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            آخر {product.stock} قطع
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                        
                        {product.fragrance && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {product.fragrance}
                          </p>
                        )}
                        
                        {product.volume && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {product.volume} مل
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl font-bold text-accent">
                            {product.price.toFixed(2)} د.م
                          </span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < 4 ? "currentColor" : "none"}
                                className="text-accent"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {products.length > productsPerSlide && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "bg-primary w-8 h-3"
                      : "bg-primary/30 w-3 h-3 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            عرض جميع المنتجات
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

