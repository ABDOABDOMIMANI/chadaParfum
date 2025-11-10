"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Star, Search, ShoppingCart, Grid, LayoutGrid, Square } from "lucide-react"
import { useState, useMemo, useEffect, useCallback } from "react"
import Image from "next/image"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"
import { LoadingSpinner, ProductGridSkeleton } from "@/components/loading-spinner"

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

interface Category {
  id: number
  name: string
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("default")
  const [minPriceFilter, setMinPriceFilter] = useState(0)
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000)
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(3) // Changed to 3 items per page
  const [currentPage, setCurrentPage] = useState(1)
  const [viewLayout, setViewLayout] = useState<"grid-2" | "grid-3" | "grid-4">("grid-3")

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProducts()
      fetchCategories()
    }
  }, []) // Empty deps - functions are stable

  useEffect(() => {
    // Calculate price range from products
    if (products.length > 0) {
      const prices = products.map((p) => p.originalPrice || p.price)
      const maxPrice = Math.max(...prices)
      // Always start from 0
      setMinPriceFilter(0)
      setMaxPriceFilter(maxPrice)
    }
  }, [products])

  const addToCart = (productId: number) => {
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
    } catch (e) {
      console.error("Error parsing imageDetails:", e)
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

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Check cache first (client-side caching)
      const cacheKey = 'products_cache'
      const cacheTime = 60000 // 1 minute
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < cacheTime) {
          setProducts(data.filter((p: Product) => p.active))
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
      const filtered = data.filter((p: Product) => p.active && p.stock > 0)
      setProducts(filtered)
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Error fetching products:", error)
      // Try to use cached data on error
      const cacheKey = 'products_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data } = JSON.parse(cached)
        setProducts(data.filter((p: Product) => p.active && p.stock > 0))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      // Check cache first (client-side caching)
      const cacheKey = 'categories_cache'
      const cacheTime = 300000 // 5 minutes
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < cacheTime) {
          setCategories(data)
          return
        }
      }
      
      const res = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      })
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Try to use cached data on error
      const cacheKey = 'categories_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data } = JSON.parse(cached)
        setCategories(data)
      }
    }
  }, [])


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

  const isProductOnPromotion = (product: Product): boolean => {
    if (!product.discountPercentage || product.discountPercentage <= 0) return false
    if (!product.promotionStartDate || !product.promotionEndDate) return true // If dates not set, consider it always on promotion
    
    const today = new Date()
    const startDate = new Date(product.promotionStartDate)
    const endDate = new Date(product.promotionEndDate)
    
    return today >= startDate && today <= endDate
  }

  const getDisplayPrice = (product: Product): { original: number; current: number; onSale: boolean } => {
    const onPromo = isProductOnPromotion(product)
    if (onPromo && product.originalPrice) {
      return {
        original: product.originalPrice,
        current: product.price,
        onSale: true,
      }
    }
    return {
      original: product.price,
      current: product.price,
      onSale: false,
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.fragrance?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category.id.toString() === selectedCategory
      
      const priceInfo = getDisplayPrice(product)
      const matchesPrice = priceInfo.current >= minPriceFilter && priceInfo.current <= maxPriceFilter
      // Stock is now managed per-image, so we check imageDetails
      let matchesStock = true
      if (inStock && product.imageDetails) {
        try {
          const imageDetails = JSON.parse(product.imageDetails)
          if (Array.isArray(imageDetails)) {
            matchesStock = imageDetails.some((img: any) => (img.quantity ?? 0) > 0)
          }
        } catch (e) {
          console.error("Error parsing imageDetails:", e)
        }
      }
      const matchesSale = !onSale || isProductOnPromotion(product)

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesSale
    })

    // Apply sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const priceA = getDisplayPrice(a).current
        const priceB = getDisplayPrice(b).current
        return priceA - priceB
      })
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const priceA = getDisplayPrice(a).current
        const priceB = getDisplayPrice(b).current
        return priceB - priceA
      })
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "newest") {
      result.reverse()
    }

    return result
  }, [products, searchTerm, selectedCategory, sortBy, minPriceFilter, maxPriceFilter, inStock, onSale])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy, minPriceFilter, maxPriceFilter, inStock, onSale])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getGridCols = () => {
    switch (viewLayout) {
      case "grid-2":
        return "grid-cols-1 md:grid-cols-2"
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      case "grid-4":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    }
  }

  // Always start price filter from 0
  const minPrice = 0
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.originalPrice || p.price)) : 1000

  return (
    <>
      <Header />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">متجرنا</h1>
            <p className="text-lg text-muted-foreground">اكتشف مجموعتنا الكاملة من العطور الفاخرة</p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-32">
                {/* Price Filter - Yellow Style */}
                <div>
                  <h3 className="font-bold text-primary mb-4">تصفية حسب السعر</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">من: {minPriceFilter.toFixed(2)} د.م</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={minPriceFilter}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (val <= maxPriceFilter) setMinPriceFilter(val)
                        }}
                        className="w-full accent-yellow-500"
                        style={{ accentColor: "#ffc107" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">إلى: {maxPriceFilter.toFixed(2)} د.م</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={maxPriceFilter}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (val >= minPriceFilter) setMaxPriceFilter(val)
                        }}
                        className="w-full accent-yellow-500"
                        style={{ accentColor: "#ffc107" }}
                      />
                    </div>
                    <div className="text-sm text-center py-2 rounded" style={{ backgroundColor: "#ffc107", color: "#000" }}>
                      السعر: {minPriceFilter.toFixed(2)} د.م - {maxPriceFilter.toFixed(2)} د.م
                    </div>
                    <button
                      onClick={() => {
                        setMinPriceFilter(0)
                        setMaxPriceFilter(maxPrice)
                      }}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      إعادة تعيين
                    </button>
                  </div>
                </div>

                {/* Stock Status - Arabic */}
                <div>
                  <h3 className="font-bold text-primary mb-4">حالة المخزون</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">في العرض</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">متوفر</span>
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-primary mb-4">الفئات</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-right px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      الكل
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id.toString())}
                        className={`w-full text-right px-3 py-2 rounded text-sm transition-colors ${
                          selectedCategory === cat.id.toString()
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                {/* Items per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">عرض:</span>
                  <div className="flex gap-2">
                    {[9, 12, 18, 24].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setItemsPerPage(num)
                          setCurrentPage(1)
                        }}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          itemsPerPage === num
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Layout */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewLayout("grid-2")}
                    className={`p-2 rounded transition-colors ${
                      viewLayout === "grid-2" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewLayout("grid-3")}
                    className={`p-2 rounded transition-colors ${
                      viewLayout === "grid-3" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewLayout("grid-4")}
                    className={`p-2 rounded transition-colors ${
                      viewLayout === "grid-4" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <Square size={18} />
                  </button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">ترتيب حسب</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                  >
                    <option value="default">الافتراضي</option>
                    <option value="price-low">السعر: منخفض إلى مرتفع</option>
                    <option value="price-high">السعر: مرتفع إلى منخفض</option>
                    <option value="name">الاسم</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن عطر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-border rounded bg-background text-foreground"
                />
              </div>

              {/* Loading State */}
              {loading && <ProductGridSkeleton count={3} />}

              {/* No results message */}
              {!loading && filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">لم يتم العثور على عطور تطابق البحث</p>
                </div>
              )}

              {/* Product Grid */}
              {!loading && (
                <>
                  <div className={`grid ${getGridCols()} gap-6 mb-8`}>
                    {paginatedProducts.map((product) => {
                      const priceInfo = getDisplayPrice(product)
                      return (
                        <div
                          key={product.id}
                          className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <Link href={`/product/${product.id}`} className="relative block overflow-hidden h-48 bg-secondary">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              loading="lazy"
                              quality={85}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                            {priceInfo.onSale && product.discountPercentage && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                -{product.discountPercentage}%
                              </div>
                            )}
                          </Link>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{product.category.name}</p>
                            {product.fragrance && (
                              <p className="text-xs text-muted-foreground mb-2">{product.fragrance}</p>
                            )}
                            {product.volume && (
                              <p className="text-xs text-muted-foreground mb-3">{product.volume} مل</p>
                            )}
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex flex-col">
                                {priceInfo.onSale ? (
                                  <>
                                    <span className="text-sm line-through opacity-60 text-muted-foreground">
                                      {priceInfo.original.toFixed(2)} د.م
                                    </span>
                                    <span className="text-xl font-bold text-foreground">
                                      {priceInfo.current.toFixed(2)} د.م
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-foreground">
                                    {priceInfo.current.toFixed(2)} د.م
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className="text-accent" />
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/product/${product.id}`}
                                className="flex-1 text-center py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                              >
                                عرض التفاصيل
                              </Link>
                              <button
                                onClick={() => addToCart(product.id)}
                                className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors"
                                title="أضف إلى السلة"
                              >
                                <ShoppingCart size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        السابق
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
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
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        التالي
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
