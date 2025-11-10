"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: { id: number; name: string }
  imageUrls?: string
  imageDetails?: string
  imageUrl?: string
  fragrance?: string
  volume?: number
  active: boolean
}

interface CartItem {
  productId: number
  quantity: number
  selectedImageIndex?: number
  price?: number
}

interface OrderFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerLocation?: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerLocation: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadCart()
      fetchProducts()
    }
  }, []) // Remove fetchProducts from deps to avoid circular dependency

  const loadCart = useCallback(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("chada_cart")
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          setCart(cartData)
          if (cartData.length === 0) {
            router.push("/shop")
          }
        } catch (e) {
          console.error("Error loading cart:", e)
          setCart([])
        }
      } else {
        setCart([])
      }
    }
  }, [router])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Check cache first (client-side caching)
      const cacheKey = 'cart_products_cache'
      const cacheTime = 60000 // 1 minute
      const cached = localStorage.getItem(cacheKey)
      const now = Date.now()
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < cacheTime) {
          setProducts(data)
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
      setProducts(data)
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("فشل تحميل المنتجات")
      // Try to use cached data on error
      const cacheKey = 'cart_products_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data } = JSON.parse(cached)
        setProducts(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const getCartProducts = useCallback((): (Product & { quantity: number; cartPrice?: number; selectedImageIndex?: number })[] => {
    if (!cart || !products) return []
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product && product.active) {
          // Use cart price if available (image-specific price)
          const cartPrice = item.price
          // Get stock from imageDetails if available
          let maxQuantity = 999 // Default high value
          if (item.selectedImageIndex !== undefined && product.imageDetails) {
            try {
              const imageDetails = JSON.parse(product.imageDetails)
              if (Array.isArray(imageDetails) && imageDetails[item.selectedImageIndex]) {
                maxQuantity = imageDetails[item.selectedImageIndex].quantity ?? 0
              }
            } catch (e) {
              console.error("Error parsing imageDetails:", e)
            }
          }
          return { 
            ...product, 
            quantity: Math.min(item.quantity, maxQuantity),
            cartPrice,
            selectedImageIndex: item.selectedImageIndex,
          }
        }
        return null
      })
      .filter((item): item is Product & { quantity: number; cartPrice?: number; selectedImageIndex?: number } => item !== null)
  }, [cart, products])

  const updateQuantity = (productId: number, selectedImageIndex: number | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, selectedImageIndex)
      return
    }
    const updatedCart = cart.map((item) => {
      // Match by productId and selectedImageIndex if provided
      if (item.productId === productId && 
          (selectedImageIndex === undefined || item.selectedImageIndex === selectedImageIndex)) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCart(updatedCart)
    localStorage.setItem("chada_cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("storage"))
  }

  const removeItem = (productId: number, selectedImageIndex?: number) => {
    const updatedCart = cart.filter((item) => {
      // Remove item if it matches productId and selectedImageIndex (if provided)
      if (selectedImageIndex !== undefined) {
        return !(item.productId === productId && item.selectedImageIndex === selectedImageIndex)
      }
      return item.productId !== productId
    })
    setCart(updatedCart)
    localStorage.setItem("chada_cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("storage"))
    if (updatedCart.length === 0) {
      router.push("/shop")
    }
  }


  const getProductImage = useCallback((product: Product, selectedImageIndex?: number): string => {
    try {
      // Try imageDetails first (new format)
      if (product.imageDetails) {
        const imageDetails = JSON.parse(product.imageDetails)
        if (Array.isArray(imageDetails) && imageDetails.length > 0) {
          const imageIndex = selectedImageIndex !== undefined ? selectedImageIndex : 0
          const imageDetail = imageDetails[imageIndex]
          if (imageDetail) {
            const url = imageDetail.url || imageDetail
            return buildImageUrl(url)
          }
        }
      }
      // Fallback to imageUrls
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          const imageIndex = selectedImageIndex !== undefined ? selectedImageIndex : 0
          const imagePath = imageUrls[imageIndex] || imageUrls[0]
          return buildImageUrl(imagePath)
        }
      }
      if (product.imageUrl) {
        return buildImageUrl(product.imageUrl)
      }
    } catch (e) {
      // Ignore
    }
    return "/placeholder.svg?height=150&width=150"
  }, [])


  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (getCartProducts().length === 0) {
      setError("السلة فارغة")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const orderData: any = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        items: getCartProducts().map((item) => {
          const itemPrice = item.cartPrice || item.price
          return {
            product: { id: item.id },
            quantity: item.quantity,
            price: itemPrice, // Send the price from cart (image-specific price if available)
          }
        }),
      }
      
      // Add optional location if provided
      if (formData.customerLocation && formData.customerLocation.trim() !== "") {
        orderData.customerLocation = formData.customerLocation
      }

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create order")
      }

      const order = await res.json()
      setOrderId(order.id)
      setOrderSuccess(true)

      // Clear cart
      localStorage.removeItem("chada_cart")
      setCart([])
      window.dispatchEvent(new Event("storage"))

      // Redirect to shop after 3 seconds
      setTimeout(() => {
        router.push("/shop")
      }, 3000)
    } catch (error: any) {
      console.error("Error submitting order:", error)
      setError(error.message || "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setSubmitting(false)
    }
  }

  const cartProducts = useMemo(() => {
    if (typeof window === "undefined") return []
    return getCartProducts()
  }, [products, cart])
  
  const total = useMemo(() => {
    if (typeof window === "undefined") return 0
    return cartProducts.reduce((total, item) => {
      const itemPrice = item.cartPrice || item.price
      return total + itemPrice * item.quantity
    }, 0)
  }, [cartProducts])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل السلة...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-primary mb-4">تم إنشاء الطلب بنجاح!</h1>
              <p className="text-lg text-muted-foreground mb-2">
                رقم الطلب: <span className="font-bold text-primary">#{orderId}</span>
              </p>
              <p className="text-muted-foreground mb-6">
                شكراً لك! سنتواصل معك قريباً لتأكيد الطلب.
              </p>
              <Link href="/shop">
                <Button className="gap-2">
                  العودة إلى المتجر
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">السلة</h1>

          {cartProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground mb-4">السلة فارغة</p>
              <Link href="/shop">
                <Button>تسوق الآن</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartProducts.map((item, index) => {
                  const itemPrice = item.cartPrice || item.price
                  const itemKey = `${item.id}-${item.selectedImageIndex || 0}`
                  return (
                    <div
                      key={itemKey}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={getProductImage(item, item.selectedImageIndex)}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="96px"
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.category.name}</p>
                        <p className="text-lg font-bold text-black mb-4">
                          {itemPrice.toFixed(2)} د.م
                          {item.cartPrice && item.cartPrice !== item.price && (
                            <span className="text-xs font-normal text-muted-foreground mr-2">
                              (سعر خاص بالصورة)
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedImageIndex, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-secondary transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedImageIndex, item.quantity + 1)}
                              disabled={(() => {
                                // Get stock from product imageDetails
                                const product = products.find((p) => p.id === item.productId)
                                if (product && item.selectedImageIndex !== undefined && product.imageDetails) {
                                  try {
                                    const imageDetails = JSON.parse(product.imageDetails)
                                    if (Array.isArray(imageDetails) && imageDetails[item.selectedImageIndex]) {
                                      const imageStock = imageDetails[item.selectedImageIndex].quantity ?? 0
                                      return item.quantity >= imageStock
                                    }
                                  } catch (e) {
                                    console.error("Error parsing imageDetails:", e)
                                  }
                                }
                                return false
                              })()}
                              className="px-3 py-2 hover:bg-secondary transition-colors disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.selectedImageIndex)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-black">
                          {(itemPrice * item.quantity).toFixed(2)} د.م
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-32">
                  <h2 className="text-2xl font-bold text-primary mb-6">ملخص الطلب</h2>

                  <div className="space-y-4 mb-6">
                    {cartProducts.map((item, index) => {
                      const itemPrice = item.cartPrice || item.price
                      const itemKey = `${item.id}-${item.selectedImageIndex || 0}`
                      return (
                        <div key={itemKey} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-semibold text-black">
                            {(itemPrice * item.quantity).toFixed(2)} د.م
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-black">
                      <span>الإجمالي</span>
                      <span>{total.toFixed(2)} د.م</span>
                    </div>
                  </div>

                  {/* Order Form */}
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="بريدك الإلكتروني"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="رقم الهاتف"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">العنوان</label>
                      <textarea
                        required
                        value={formData.customerAddress}
                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                        placeholder="العنوان الكامل"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">الموقع (اختياري)</label>
                      <input
                        type="text"
                        value={formData.customerLocation}
                        onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="موقع العميل (اختياري)"
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full h-12 text-base gap-2">
                      {submitting ? "جاري إنشاء الطلب..." : "إنشاء الطلب"}
                      <ArrowRight size={20} />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

