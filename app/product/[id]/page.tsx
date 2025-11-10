"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"

interface ProductImage {
  url: string
  price?: number
  description?: string
  quantity?: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  promotionStartDate?: string
  promotionEndDate?: string
  category: { id: number; name: string }
  imageUrls?: string
  imageDetails?: string
  imageUrl?: string
  fragrance?: string
  volume?: number
  active: boolean
}

interface Review {
  id: number
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewStats {
  averageRating: number
  reviewCount: number
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ averageRating: 0, reviewCount: 0 })
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedImageDetail, setSelectedImageDetail] = useState<ProductImage | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    comment: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [imageZoom, setImageZoom] = useState({ x: 50, y: 50, visible: false })
  const [showMiniCart, setShowMiniCart] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [flyingItem, setFlyingItem] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 })

  useEffect(() => {
    if (productId) {
      fetchProduct()
      fetchReviews()
      fetchReviewStats()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/products/${productId}`)
      console.log("res", res)
      if (!res.ok) throw new Error("Failed to fetch product")
      const data = await res.json()
      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`)
      if (!res.ok) throw new Error("Failed to fetch reviews")
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const fetchReviewStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}/stats`)
      if (!res.ok) throw new Error("Failed to fetch review stats")
      const data = await res.json()
      setReviewStats(data)
    } catch (error) {
      console.error("Error fetching review stats:", error)
    }
  }


  // Memoize product images to prevent unnecessary recalculations
  const images = useMemo((): { url: string; detail?: ProductImage }[] => {
    if (!product) return []
    try {
      // Try to get image details first (new format)
      if (product.imageDetails) {
        const imageDetails = JSON.parse(product.imageDetails)
        if (Array.isArray(imageDetails) && imageDetails.length > 0) {
          const builtImages = imageDetails.map((img: any) => {
            const url = img.url || img
            if (!url || url.trim() === "") return null
            const fullUrl = buildImageUrl(url)
            console.log("Built image URL from imageDetails:", fullUrl, "from:", url)
            return {
              url: fullUrl,
              detail: {
                url: fullUrl,
                price: img.price,
                description: img.description,
                quantity: img.quantity,
              }
            }
          }).filter((img): img is { url: string; detail?: ProductImage } => img !== null)
          if (builtImages.length > 0) return builtImages
        }
      }
      // Fallback to imageUrls (legacy format)
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          const builtUrls = imageUrls.map((url: string) => {
            if (!url || url.trim() === "") return null
            const fullUrl = buildImageUrl(url)
            console.log("Built image URL from imageUrls:", fullUrl, "from:", url)
            return { url: fullUrl }
          }).filter((img): img is { url: string } => img !== null)
          if (builtUrls.length > 0) return builtUrls
        }
      }
      if (product.imageUrl && product.imageUrl.trim() !== "") {
        const fullUrl = buildImageUrl(product.imageUrl)
        console.log("Built image URL from imageUrl:", fullUrl, "from:", product.imageUrl)
        return [{ url: fullUrl }]
      }
    } catch (e) {
      console.error("Error parsing product images:", e, product)
    }
    console.warn("No images found for product:", product?.id, product?.name, {
      imageUrl: product?.imageUrl,
      imageUrls: product?.imageUrls,
      imageDetails: product?.imageDetails
    })
    return []
  }, [product])

  // Update selected image detail when selectedImage or images change
  useEffect(() => {
    if (images.length > 0 && images[selectedImage]?.detail) {
      setSelectedImageDetail(images[selectedImage].detail!)
    } else {
      setSelectedImageDetail(null)
    }
  }, [selectedImage, images])

  // Get current price - use image-specific price if available, otherwise use product price
  const getCurrentPrice = (): number => {
    if (selectedImageDetail?.price) {
      return selectedImageDetail.price
    }
    return product?.price || 0
  }

  // Get current description - use image-specific description if available, otherwise use product description
  const getCurrentDescription = (): string => {
    if (selectedImageDetail?.description) {
      return selectedImageDetail.description
    }
    return product?.description || ""
  }

  // Get current stock - use image-specific quantity
  const getCurrentStock = (): number => {
    if (selectedImageDetail?.quantity !== undefined && selectedImageDetail?.quantity !== null) {
      return selectedImageDetail.quantity
    }
    return 0
  }

  const addToCart = (event?: React.MouseEvent) => {
    if (!product) return
    const currentStock = getCurrentStock()
    if (quantity > currentStock) {
      alert(`المخزون المتاح: ${currentStock} قطعة`)
      return
    }
    const cart = JSON.parse(localStorage.getItem("chada_cart") || "[]")
    const currentPrice = getCurrentPrice()
    const existingItem = cart.find((item: any) => 
      item.productId === product.id && item.selectedImageIndex === selectedImage
    )
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > currentStock) {
        alert(`المخزون المتاح: ${currentStock} قطعة. لديك بالفعل ${existingItem.quantity} في السلة.`)
        return
      }
      existingItem.quantity = newQuantity
    } else {
      cart.push({ 
        productId: product.id, 
        quantity,
        selectedImageIndex: selectedImage,
        price: currentPrice, // Use the current price (image-specific or product price)
      })
    }
    localStorage.setItem("chada_cart", JSON.stringify(cart))
    
    // Trigger flying animation
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect()
      // Try to find cart icon in header
      const cartIcon = document.querySelector('a[href="/cart"]') as HTMLElement
      if (cartIcon) {
        setFlyingItem({
          visible: true,
          x: buttonRect.left + buttonRect.width / 2,
          y: buttonRect.top + buttonRect.height / 2,
        })
        setTimeout(() => {
          setFlyingItem({ visible: false, x: 0, y: 0 })
        }, 1000)
      } else {
        // Fallback: just show animation without specific target
        setFlyingItem({
          visible: true,
          x: buttonRect.left + buttonRect.width / 2,
          y: buttonRect.top + buttonRect.height / 2,
        })
        setTimeout(() => {
          setFlyingItem({ visible: false, x: 0, y: 0 })
        }, 1000)
      }
    }
    
    // Show mini cart animation
    setShowMiniCart(true)
    setTimeout(() => {
      setShowMiniCart(false)
    }, 2000)
    
    window.dispatchEvent(new Event("storage"))
  }

  const quickPurchase = () => {
    addToCart()
    // Navigate to cart after a short delay to show animation
    setTimeout(() => {
      window.location.href = "/cart"
    }, 500)
  }

  const shareProduct = async () => {
    if (typeof window !== "undefined") {
      const productUrl = window.location.href
      try {
        await navigator.clipboard.writeText(productUrl)
        setCopiedLink(true)
        setTimeout(() => {
          setCopiedLink(false)
        }, 2000)
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = productUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopiedLink(true)
        setTimeout(() => {
          setCopiedLink(false)
        }, 2000)
      }
    }
  }

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setImageZoom({ x, y, visible: true })
  }

  const handleImageMouseLeave = () => {
    setImageZoom({ x: 50, y: 50, visible: false })
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      setSubmittingReview(true)
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: { id: product.id },
          customerName: reviewForm.customerName,
          customerEmail: reviewForm.customerEmail,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit review")

      // Reset form
      setReviewForm({ customerName: "", customerEmail: "", rating: 5, comment: "" })
      setShowReviewForm(false)

      // Refresh reviews
      fetchReviews()
      fetchReviewStats()
      alert("شكراً لك! تم إضافة تقييمك بنجاح.")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("حدث خطأ أثناء إضافة التقييم. يرجى المحاولة مرة أخرى.")
    } finally {
      setSubmittingReview(false)
    }
  }

  // Calculate display images (fallback to placeholder if empty)
  const displayImages = images.length > 0 ? images : [{ url: "/placeholder.svg?height=600&width=600" }]
  
  // Debug: Log images for troubleshooting
  useEffect(() => {
    if (product) {
      console.log("Product images debug:", {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        imageUrls: product.imageUrls,
        imageDetails: product.imageDetails,
        builtImages: images,
        displayImages: displayImages
      })
    }
  }, [product, images, displayImages])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-32 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل المنتج...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-32 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">المنتج غير موجود</h1>
            <Link href="/shop" className="text-primary hover:underline">
              العودة إلى المتجر
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      {/* Flying Item Animation */}
      {flyingItem.visible && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${flyingItem.x}px`,
            top: `${flyingItem.y}px`,
            animation: "flyToCart 1s ease-out forwards",
          }}
        >
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
            <ShoppingCart size={24} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Mini Cart Popup */}
      {showMiniCart && (
        <div
          className="fixed bottom-24 right-4 z-50 bg-card border border-border rounded-lg shadow-2xl p-4 max-w-xs animate-slide-up"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <ShoppingCart size={24} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">تمت الإضافة!</p>
              <p className="text-xs text-muted-foreground">{product?.name} - {quantity} قطعة</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">
              المتجر
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery with Zoom - Smaller main image to show thumbnails */}
            <div>
              <div
                className="mb-4 rounded-lg overflow-hidden bg-secondary h-[450px] flex items-center justify-center relative cursor-zoom-in"
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
              >
                {(() => {
                  const imageUrl = displayImages[selectedImage]?.url || displayImages[0]?.url
                  if (!imageUrl || imageUrl.includes("placeholder")) {
                    return (
                      <div className="text-center text-muted-foreground">
                        <p>لا توجد صورة</p>
                      </div>
                    )
                  }
                  return (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-200"
                      style={{
                        transform: imageZoom.visible ? `scale(2)` : "scale(1)",
                        transformOrigin: `${imageZoom.x}% ${imageZoom.y}%`,
                      }}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={90}
                      priority={selectedImage === 0}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={(e) => {
                        console.error("Image load error for URL:", imageUrl)
                        console.error("Error event:", e)
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", imageUrl)
                      }}
                      unoptimized={false}
                    />
                  )
                })()}
              </div>
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {displayImages.map((img, idx) => {
                    const isSelected = selectedImage === idx
                    const imageDetail = img.detail
                    const imagePrice = imageDetail?.price
                    const imageQuantity = imageDetail?.quantity ?? 0
                    const isInactive = imageQuantity === 0
                    return (
                      <button
                        key={idx}
                        onClick={() => !isInactive && setSelectedImage(idx)}
                        disabled={isInactive}
                        className={`rounded-lg overflow-hidden border-2 h-24 transition-all relative group ${
                          isInactive 
                            ? "border-gray-400 opacity-50 cursor-not-allowed" 
                            : isSelected 
                              ? "border-primary ring-2 ring-primary" 
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`صورة ${idx + 1}`}
                          fill
                          className={`object-cover ${isInactive ? "grayscale" : ""}`}
                          sizes="96px"
                          quality={75}
                          loading="lazy"
                        />
                        {/* Inactive Overlay */}
                        {isInactive && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">غير متوفر</span>
                          </div>
                        )}
                        {/* Price and Quantity Badge */}
                        {imagePrice !== undefined && imagePrice !== null && (
                          <div className={`absolute bottom-0 left-0 right-0 p-1 text-[10px] font-bold text-white ${
                            isInactive 
                              ? "bg-gray-600" 
                              : isSelected 
                                ? "bg-primary" 
                                : "bg-black/70 group-hover:bg-primary/80"
                          } transition-colors`}>
                            <div className="text-center">
                              {imagePrice.toFixed(2)} د.م
                              {imageQuantity !== undefined && imageQuantity !== null && (
                                <span className="block text-[9px] opacity-90">
                                  ({imageQuantity} قطعة)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < Math.round(reviewStats.averageRating) ? "currentColor" : "none"}
                        className="text-accent"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({reviewStats.reviewCount} تقييم) - {reviewStats.averageRating.toFixed(1)}/5
                  </span>
                </div>

                {/* Price with Promotion - Dynamic based on selected image */}
                <div className="mb-6">
                  {(() => {
                    const currentPrice = getCurrentPrice()
                    const imagePrice = selectedImageDetail?.price
                    const hasImageSpecificPrice = imagePrice !== null && imagePrice !== undefined
                    const showPromotion = product.discountPercentage && product.discountPercentage > 0 && product.originalPrice && !hasImageSpecificPrice
                    
                    if (showPromotion) {
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-red-500">
                              {product.price.toFixed(2)} د.م
                            </span>
                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                              -{product.discountPercentage}%
                            </span>
                          </div>
                          <div className="text-xl line-through opacity-60 text-muted-foreground">
                            {product.originalPrice.toFixed(2)} د.م
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="text-4xl font-bold text-accent">
                          {currentPrice.toFixed(2)} د.م
                          {hasImageSpecificPrice && (
                            <span className="text-sm font-normal text-muted-foreground mr-2">
                              (سعر خاص بهذه الصورة)
                            </span>
                          )}
                        </div>
                      )
                    }
                  })()}
                </div>
                {/* Description - Dynamic based on selected image */}
                <div className="mb-6">
                  <p className="text-lg text-foreground leading-relaxed">
                    {getCurrentDescription()}
                  </p>
                  {selectedImageDetail?.description && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      هذا الوصف خاص بالصورة المحددة
                    </p>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 p-4 bg-secondary rounded-lg mb-6">
                {product.fragrance && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العطر:</span>
                    <span className="font-semibold text-foreground">{product.fragrance}</span>
                  </div>
                )}
                {product.volume && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحجم:</span>
                    <span className="font-semibold text-foreground">{product.volume} مل</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المخزون:</span>
                  <span className={`font-semibold ${getCurrentStock() > 10 ? "text-green-600" : getCurrentStock() > 0 ? "text-yellow-600" : "text-red-600"}`}>
                    {getCurrentStock() > 0 ? `${getCurrentStock()} قطعة متاحة` : "نفد المخزون"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الفئة:</span>
                  <span className="font-semibold text-foreground">{product.category.name}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                    className="px-3 py-2 hover:bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  onClick={(e) => addToCart(e)}
                  disabled={getCurrentStock() === 0}
                  className="flex-1 h-12 text-base gap-2"
                >
                  <ShoppingCart size={20} />
                  {getCurrentStock() > 0 ? "إضافة إلى السلة" : "نفد المخزون"}
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={shareProduct}
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                >
                  <Share2 size={20} />
                  {copiedLink ? "تم النسخ!" : "مشاركة"}
                </Button>
                <Button
                  onClick={quickPurchase}
                  disabled={getCurrentStock() === 0}
                  className="flex-1 h-12 text-base gap-2 bg-green-600 hover:bg-green-700"
                >
                  شراء سريع
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">الوصف</TabsTrigger>
              <TabsTrigger value="reviews">
                التقييمات ({reviewStats.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="details">التفاصيل</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 bg-secondary rounded-lg">
              <p className="text-lg text-foreground leading-relaxed">{product.description}</p>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {/* Review Form */}
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-primary">أضف تقييمك</h3>
                  <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? "إخفاء" : "إضافة تقييم"}
                  </Button>
                </div>

                {showReviewForm && (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">الاسم</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.customerName}
                          onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                          placeholder="أدخل اسمك"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          value={reviewForm.customerEmail}
                          onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                          placeholder="بريدك الإلكتروني"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">التقييم</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating })}
                            className="p-2"
                          >
                            <Star
                              size={24}
                              fill={rating <= reviewForm.rating ? "currentColor" : "none"}
                              className="text-accent"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">التعليق</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                        placeholder="اكتب تعليقك هنا..."
                      />
                    </div>
                    <Button type="submit" disabled={submittingReview} className="w-full">
                      {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-secondary rounded-lg">
                  <p className="text-muted-foreground">لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-secondary rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-primary">{review.customerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className="text-accent"
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-foreground">{review.comment}</p>}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="details" className="p-6 bg-secondary rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الفئة:</span>
                  <span className="font-semibold text-foreground">{product.category.name}</span>
                </div>
                {product.fragrance && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العطر:</span>
                    <span className="font-semibold text-foreground">{product.fragrance}</span>
                  </div>
                )}
                {product.volume && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحجم:</span>
                    <span className="font-semibold text-foreground">{product.volume} مل</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المخزون:</span>
                  <span className="font-semibold text-foreground">{getCurrentStock()} قطعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السعر:</span>
                  <span className="font-semibold text-accent">
                    {product.discountPercentage && product.discountPercentage > 0 && product.originalPrice
                      ? `${product.price.toFixed(2)} د.م`
                      : `${product.price.toFixed(2)} د.م`}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes flyToCart {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw - 200px), -200px) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
