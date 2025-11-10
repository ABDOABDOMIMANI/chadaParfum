"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingCart, Star } from "lucide-react"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"
import { LoadingSpinner, ProductGridSkeleton } from "@/components/loading-spinner"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: { id: number; name: string }
  imageUrls?: string
  imageUrl?: string
  imageDetails?: string
  fragrance?: string
  volume?: number
  active: boolean
}

interface ProductsSliderProps {
  limit?: number
  autoSlide?: boolean
  autoSlideInterval?: number
}

export function ProductsSlider({ limit = 3, autoSlide = true, autoSlideInterval = 5000 }: ProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const itemsPerPage = 3

  const fetchProducts = useCallback(async () => {
    if (typeof window === "undefined") return
    
    try {
      setLoading(true)
      // Check cache first (client-side caching)
      const cacheKey = 'products_slider_cache'
      const cacheTime = 60000 // 1 minute
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (now - timestamp < cacheTime) {
            const filtered = data
              .filter((p: Product) => p.active)
              .slice(0, limit)
            setProducts(filtered)
            setLoading(false)
            return
          }
        } catch (e) {
          console.error("Error parsing cached products:", e)
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
        try {
          const { data } = JSON.parse(cached)
          const filtered = data
            .filter((p: Product) => p.active && p.stock > 0)
            .slice(0, limit)
          setProducts(filtered)
        } catch (e) {
          console.error("Error parsing cached products on error:", e)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // fetchProducts depends on limit which is a prop, safe to omit for initial load

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Auto-advance pages if enabled
  useEffect(() => {
    if (autoSlide && !isPaused && totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev % totalPages) + 1)
      }, autoSlideInterval)
      return () => clearInterval(interval)
    }
  }, [autoSlide, autoSlideInterval, isPaused, totalPages])


  const getProductImage = useCallback((product: Product): string => {
    try {
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0 && imageUrls[0]) {
          const url = buildImageUrl(imageUrls[0])
          if (url && url !== "/placeholder.svg?height=300&width=300") {
            return url
          }
        }
      }
      if (product.imageUrl) {
        const url = buildImageUrl(product.imageUrl)
        if (url && url !== "/placeholder.svg?height=300&width=300") {
          return url
        }
      }
    } catch (e) {
      console.error("Error getting product image:", e, product)
    }
    return "/placeholder.svg?height=300&width=300"
  }, [])

      const addToCart = (productId: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const product = products.find((p) => p.id === productId)
        if (!product) return

        // Get first image's price and index if available
        let imagePrice: number | undefined = undefined
        let selectedImageIndex: number | undefined = 0

        try {
          if (product.imageDetails) {
            const imageDetails = JSON.parse(product.imageDetails)
            if (Array.isArray(imageDetails) && imageDetails.length > 0) {
              const firstImage = imageDetails[0]
              if (firstImage.price !== undefined && firstImage.price !== null) {
                imagePrice = parseFloat(firstImage.price.toString())
                selectedImageIndex = 0
              }
            }
          }
        } catch (err) {
          console.error("Error parsing imageDetails:", err)
        }

        const cart = JSON.parse(localStorage.getItem("chada_cart") || "[]")
        // Match by productId and selectedImageIndex (if provided)
        const existingItem = cart.find((item: any) => 
          item.productId === productId && 
          (selectedImageIndex === undefined || item.selectedImageIndex === selectedImageIndex)
        )
        
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          cart.push({ 
            productId, 
            quantity: 1,
            selectedImageIndex: selectedImageIndex,
            price: imagePrice, // Use image-specific price if available
          })
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


  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
              منتجاتنا المميزة
            </h2>
          </div>
          <ProductGridSkeleton count={3} />
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
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

                  {/* Stock Badge - Check imageDetails for low stock */}
                  {(() => {
                    let totalStock = 0
                    let minStock = Infinity
                    if (product.imageDetails) {
                      try {
                        const imageDetails = JSON.parse(product.imageDetails)
                        if (Array.isArray(imageDetails)) {
                          imageDetails.forEach((img: any) => {
                            const qty = img.quantity ?? 0
                            totalStock += qty
                            if (qty > 0 && qty < minStock) {
                              minStock = qty
                            }
                          })
                        }
                      } catch (e) {
                        // Ignore parsing errors
                      }
                    }
                    // Show badge if total stock is less than 10 or any image has less than 10
                    if (totalStock > 0 && (totalStock < 10 || minStock < 10)) {
                      return (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          آخر {minStock < Infinity ? minStock : totalStock} قطع
                        </div>
                      )
                    }
                    return null
                  })()}
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
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1))
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 2000)
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted flex items-center gap-2"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  setCurrentPage(i + 1)
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 2000)
                }}
                className={`px-4 py-2 border border-border rounded ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1))
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 2000)
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted flex items-center gap-2"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

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

