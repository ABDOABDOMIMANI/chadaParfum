"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingCart, Tag, X, Info } from "lucide-react"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  promotionStartDate?: string
  promotionEndDate?: string
  stock: number
  category: { id: number; name: string }
  imageUrls?: string
  imageUrl?: string
  imageDetails?: string
  fragrance?: string
  volume?: number
  active: boolean
}

interface PromotionsSliderProps {
  autoSlide?: boolean
  autoSlideInterval?: number
}

export function PromotionsSlider({ autoSlide = true, autoSlideInterval = 1000 }: PromotionsSliderProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const productsPerSlide = 4
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null)
  const [hoveredProductPosition, setHoveredProductPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const productRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const fetchPromotions = useCallback(async () => {
    if (typeof window === "undefined") return
    
    try {
      setLoading(true)
      // Check cache first (client-side caching)
      const cacheKey = 'promotions_cache'
      const cacheTime = 60000 // 1 minute
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (now - timestamp < cacheTime) {
            setProducts(data.filter((p: Product) => p.active && p.stock > 0))
            setLoading(false)
            return
          }
        } catch (e) {
          console.error("Error parsing cached promotions:", e)
        }
      }
      
      const res = await fetch(`${API_BASE_URL}/products/promotions`, {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      })
      if (!res.ok) throw new Error("Failed to fetch promotions")
      const data = await res.json()
      const filtered = data.filter((p: Product) => p.active && p.stock > 0)
      setProducts(filtered)
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Error fetching promotions:", error)
      // Try to use cached data on error
      const cacheKey = 'promotions_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data } = JSON.parse(cached)
          setProducts(data.filter((p: Product) => p.active && p.stock > 0))
        } catch (e) {
          console.error("Error parsing cached promotions on error:", e)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchPromotions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // fetchPromotions is stable (empty deps), safe to omit

  useEffect(() => {
    if (autoSlide && !isPaused && products.length > productsPerSlide) {
      const maxIndex = Math.ceil(products.length / productsPerSlide) - 1
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
      }, autoSlideInterval)
      return () => clearInterval(interval)
    }
  }, [autoSlide, autoSlideInterval, isPaused, products.length, productsPerSlide])


  const getProductImage = useCallback((product: Product): string => {
    try {
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0 && imageUrls[0]) {
          const url = buildImageUrl(imageUrls[0])
          if (url && url !== "/placeholder.svg?height=192&width=192") {
            return url
          }
        }
      }
      if (product.imageUrl) {
        const url = buildImageUrl(product.imageUrl)
        if (url && url !== "/placeholder.svg?height=192&width=192") {
          return url
        }
      }
    } catch (e) {
      console.error("Error getting product image:", e, product)
    }
    return "/placeholder.svg?height=192&width=192"
  }, [])

  const addToCart = (productId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    
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
    alert("تمت إضافة المنتج إلى السلة!")
    window.dispatchEvent(new Event("storage"))
  }

  const nextSlide = () => {
    const maxIndex = Math.ceil(products.length / productsPerSlide) - 1
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevSlide = () => {
    const maxIndex = Math.ceil(products.length / productsPerSlide) - 1
    setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1))
  }

  const goToSlide = (index: number) => {
    const maxIndex = Math.ceil(products.length / productsPerSlide) - 1
    setCurrentIndex(Math.min(index, maxIndex))
  }

  const handleMouseEnter = (product: Product, e: React.MouseEvent<HTMLDivElement>) => {
    const element = productRefs.current.get(product.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      setHoveredProductPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height,
        width: rect.width,
        height: rect.height,
      })
    }
    setHoveredProduct(product)
  }

  const handleMouseLeave = () => {
    // Delay hiding to allow mouse to move to popup
    setTimeout(() => {
      if (!popupRef.current?.matches(":hover")) {
        setHoveredProduct(null)
        setHoveredProductPosition(null)
      }
    }, 100)
  }

  const handlePopupMouseLeave = () => {
    setHoveredProduct(null)
    setHoveredProductPosition(null)
  }

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل العروض...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null // Don't show section if no promotions
  }

  const totalSlides = Math.ceil(products.length / productsPerSlide)
  const maxIndex = totalSlides - 1

  // Calculate popup position based on product position - Fixed position
  const getPopupPosition = () => {
    if (!hoveredProductPosition || !popupRef.current) return { top: 0, left: 0 }
    
    const popupWidth = 420
    const popupHeight = popupRef.current.offsetHeight || 600
    const spacing = 20

    let left = hoveredProductPosition.x - popupWidth / 2
    let top = hoveredProductPosition.y + spacing

    // Adjust if popup would go off right edge
    if (left + popupWidth > window.innerWidth - 20) {
      left = window.innerWidth - popupWidth - 20
    }
    // Adjust if popup would go off left edge
    if (left < 20) {
      left = 20
    }
    // Adjust if popup would go off bottom edge
    if (top + popupHeight > window.innerHeight - 20) {
      top = hoveredProductPosition.y - popupHeight - spacing
    }
    // Adjust if popup would go off top edge
    if (top < 20) {
      top = 20
    }

    return { top, left }
  }

  const popupPosition = hoveredProduct && hoveredProductPosition ? getPopupPosition() : { top: 0, left: 0 }

  return (
    <>
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full mb-4">
              <Tag size={20} />
              <span className="font-bold text-sm">عروض خاصة</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
              العروض والخصومات
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استفد من أفضل العروض والخصومات على مجموعة مختارة من عطورنا الفاخرة
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            {products.length > productsPerSlide && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-30 bg-primary text-primary-foreground p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:bg-primary/90"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-30 bg-primary text-primary-foreground p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:bg-primary/90"
                  aria-label="Next slide"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Slider with horizontal translation animation - slides of 4 items */}
            <div className="relative overflow-hidden py-8 mx-16">
              <div
                className="flex items-center transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${totalSlides * 100}%`,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const startIndex = slideIndex * productsPerSlide
                  const endIndex = Math.min(startIndex + productsPerSlide, products.length)
                  const slideProducts = products.slice(startIndex, endIndex)

                  return (
                    <div
                      key={slideIndex}
                      className="flex items-center justify-center gap-4 flex-shrink-0"
                      style={{
                        width: `${100 / totalSlides}%`,
                      }}
                    >
                      {slideProducts.map((product, productIdx) => {
                        const originalPrice = product.originalPrice || product.price
                        const discountPercent = product.discountPercentage || 0
                        const isHovered = hoveredProduct?.id === product.id

                        return (
                          <div
                            key={product.id}
                            ref={(el) => {
                              if (el) productRefs.current.set(product.id, el)
                            }}
                            className="flex flex-col items-center justify-center group relative flex-1"
                            style={{
                              maxWidth: `calc(${100 / productsPerSlide}% - 1rem)`,
                            }}
                            onMouseEnter={(e) => handleMouseEnter(product, e)}
                            onMouseLeave={handleMouseLeave}
                          >
                            {/* Cylindrical Product Container */}
                            <div 
                              className="relative w-full flex flex-col items-center animate-float-up-down"
                              style={{ animationDelay: `${productIdx * 0.15}s` }}
                            >
                              {/* Cylindrical Image */}
                              <div
                                className="relative w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 overflow-visible shadow-md transition-all duration-500 group-hover:scale-110 cursor-pointer"
                                style={{
                                  borderRadius: "45% 45% 45% 45% / 60% 60% 60% 60%",
                                  border: "4px solid rgb(252 165 165)",
                                  boxShadow: isHovered
                                    ? "0 4px 12px rgba(239, 68, 68, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)"
                                    : "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(239, 68, 68, 0.1)",
                                }}
                                onMouseEnter={(e) => {
                                  const target = e.currentTarget
                                  target.style.borderColor = "rgb(239 68 68)"
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.currentTarget
                                  target.style.borderColor = "rgb(252 165 165)"
                                }}
                              >
                                {/* Discount Badge - Centered at top */}
                                {discountPercent > 0 && (
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg shadow-xl animate-pulse z-20 border-4 border-white">
                                    -{discountPercent}%
                                  </div>
                                )}
                                <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: "inherit" }}>
                                  <Image
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{
                                      objectPosition: "center",
                                    }}
                                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                                    loading="lazy"
                                    quality={85}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                  />
                                </div>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                                    <Info
                                      className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-2xl mx-auto"
                                      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))" }}
                                    />
                                    <p className="text-white text-sm md:text-base font-bold mt-2 drop-shadow-lg">
                                      اضغط للمزيد
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Product Name and Price (Below Cylinder) */}
                              <div className="mt-6 text-center max-w-[250px]">
                                <h3 className="text-base md:text-lg font-bold text-primary line-clamp-1 group-hover:text-red-500 transition-colors mb-2">
                                  {product.name}
                                </h3>
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-sm line-through opacity-60 text-muted-foreground">
                                    {originalPrice.toFixed(2)} د.م
                                  </span>
                                  <span className="text-xl md:text-2xl font-bold text-red-500">
                                    {product.price.toFixed(2)} د.م
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {/* Fill empty spaces if slide has less than 4 products */}
                      {slideProducts.length < productsPerSlide &&
                        Array.from({ length: productsPerSlide - slideProducts.length }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="flex-1" style={{ maxWidth: `calc(${100 / productsPerSlide}% - 1rem)` }}></div>
                        ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dot Indicators - One dot per slide */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fixed Popup Tooltip with Product Details */}
      {hoveredProduct && hoveredProductPosition && (
        <div
          ref={popupRef}
          className="fixed z-50 pointer-events-auto animate-fade-in-popup"
          style={{
            left: `${popupPosition.left}px`,
            top: `${popupPosition.top}px`,
            maxWidth: "420px",
            width: "400px",
          }}
          onMouseEnter={() => {
            // Keep popup visible when hovering over it
          }}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 p-6 cursor-pointer hover:shadow-red-500/30 transition-all duration-300"
            style={{
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), 0 0 50px rgba(239, 68, 68, 0.3)",
            }}
            onClick={() => handleProductClick(hoveredProduct.id)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePopupMouseLeave()
              }}
              className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X size={18} className="text-gray-500" />
            </button>

            {/* Product Image */}
            <div className="mb-4 -mt-2 relative w-full h-56">
              <Image
                src={getProductImage(hoveredProduct)}
                alt={hoveredProduct.name}
                fill
                className="object-cover rounded-xl shadow-lg"
                sizes="400px"
                loading="lazy"
                quality={85}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {hoveredProduct.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{hoveredProduct.category.name}</p>
              </div>

              {/* Description */}
              {hoveredProduct.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {hoveredProduct.description}
                </p>
              )}

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                {hoveredProduct.fragrance && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-400 text-xs mb-1">العطر</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{hoveredProduct.fragrance}</span>
                  </div>
                )}
                {hoveredProduct.volume && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-400 text-xs mb-1">السعة</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{hoveredProduct.volume} مل</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs mb-1">المخزون</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{hoveredProduct.stock} قطعة</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 text-xs mb-1">الخصم</span>
                  <span className="font-semibold text-red-500">
                    {hoveredProduct.discountPercentage || 0}%
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm line-through opacity-60 text-gray-500 block mb-1">
                      {(hoveredProduct.originalPrice || hoveredProduct.price).toFixed(2)} د.م
                    </span>
                    <div className="text-3xl font-bold text-red-500">
                      {hoveredProduct.price.toFixed(2)} د.م
                    </div>
                  </div>
                  {hoveredProduct.discountPercentage && (
                    <div className="px-4 py-2 bg-red-500 text-white rounded-full text-lg font-bold shadow-lg">
                      -{hoveredProduct.discountPercentage}%
                    </div>
                  )}
                </div>
              </div>

              {/* Promotion Dates */}
              {(hoveredProduct.promotionStartDate || hoveredProduct.promotionEndDate) && (
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  {hoveredProduct.promotionStartDate && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">من:</span>
                      <span>{formatDate(hoveredProduct.promotionStartDate)}</span>
                    </p>
                  )}
                  {hoveredProduct.promotionEndDate && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">إلى:</span>
                      <span>{formatDate(hoveredProduct.promotionEndDate)}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProductClick(hoveredProduct.id)
                  }}
                  className="flex-1 text-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                >
                  عرض التفاصيل
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(hoveredProduct.id, e)
                  }}
                  className="px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  title="أضف إلى السلة"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-popup {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float-up-down {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-fade-in-popup {
          animation: fade-in-popup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-float-up-down {
          animation: float-up-down 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
