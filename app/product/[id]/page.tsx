"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Heart, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PRODUCT_DATABASE = {
  1: {
    name: "عطر الياسمين الملكي",
    price: 280,
    rating: 5,
    reviews: 124,
    description: "عطر فاخر يجمع بين رائحة الياسمين الرقيقة مع نوتات زهرية ناعمة",
    fullDescription:
      "يقدم عطر الياسمين الملكي تجربة حسية فريدة تعكس الفخامة والأناقة. بصيغة متوازنة تجمع بين رائحة الياسمين الطبيعية والمسك الدافئ، هذا العطر مثالي للمناسبات الخاصة والاستخدام اليومي.",
    notes: ["الياسمين", "الورد", "المسك", "الفانيليا"],
    concentration: "عطر - 75ml",
    volume: "75 مل",
    longevity: "8-10 ساعات",
    sillage: "قوي",
    image: "/luxury-jasmine-perfume.jpg",
    category: "цветي",
  },
  2: {
    name: "عطر الزعفران الشرقي",
    price: 320,
    rating: 5,
    reviews: 98,
    description: "عطر شرقي بنكهات دافئة تمزج بين الزعفران والعود",
    fullDescription:
      "عطر الزعفران الشرقي يحمل رائحة دافئة وغنية تعكس الحضارة الشرقية. بمزيج متقن من الزعفران الفاخر والعود الطبيعي والمسك، يناسب المساءات الخاصة والاحتفالات.",
    notes: ["الزعفران", "العود", "الورد", "المسك"],
    concentration: "عطر - 75ml",
    volume: "75 مل",
    longevity: "10-12 ساعة",
    sillage: "قوي جداً",
    image: "/luxury-saffron-perfume.jpg",
    category: "شرقي",
  },
}

export default function ProductPage() {
  const params = useParams()
  const productId = Number(params.id)
  const product = PRODUCT_DATABASE[productId as keyof typeof PRODUCT_DATABASE]

  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 px-4">
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

  const images = [product.image, product.image, product.image]

  const reviews = [
    { id: 1, author: "فاطمة أحمد", rating: 5, title: "عطر رائع جداً", comment: "رائحة فاخرة وتدوم طويلاً، ممتاز جداً!", date: "2025-01-15" },
    { id: 2, author: "أحمد خالد", rating: 5, title: "أفضل عطر اشتريته", comment: "الجودة عالية جداً والسعر مناسب", date: "2025-01-10" },
    { id: 3, author: "سارة محمود", rating: 4, title: "جيد جداً", comment: "عطر لطيف والرائحة تدوم وقتاً طويلاً", date: "2025-01-05" },
  ]

  const relatedProducts = [
    { id: 3, name: "عطر الورد الدمشقي", price: 250, image: "/luxury-rose-perfume.jpg", rating: 4 },
    { id: 4, name: "عطر المسك الأسود", price: 300, image: "/luxury-musk-perfume.jpg", rating: 5 },
    { id: 5, name: "عطر الفانيليا الذهبية", price: 270, image: "/luxury-vanilla-perfume.jpg", rating: 4 },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">الرئيسية</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">المتجر</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden bg-secondary h-96 flex items-center justify-center">
                <img src={images[selectedImage] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`rounded-lg overflow-hidden border-2 h-24 ${selectedImage === idx ? "border-primary" : "border-border"}`}>
                    <img src={img || "/placeholder.svg"} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
                  <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-2 rounded-full transition-colors ${isWishlisted ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
                    <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-1">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" className="text-accent"/>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} تقييم)</span>
                </div>

                <div className="text-4xl font-bold text-accent mb-6">{product.price} ر.س</div>
                <p className="text-lg text-foreground leading-relaxed mb-6">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="space-y-4 p-4 bg-secondary rounded-lg mb-6">
                <div className="flex justify-between"><span className="text-muted-foreground">التركيز:</span><span className="font-semibold text-foreground">{product.concentration}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الحجم:</span><span className="font-semibold text-foreground">{product.volume}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">المدة:</span><span className="font-semibold text-foreground">{product.longevity}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الانتشار:</span><span className="font-semibold text-foreground">{product.sillage}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2">−</button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2">+</button>
                </div>
                <Button className="flex-1 h-12 text-base gap-2"><Check size={20}/>إضافة إلى السلة</Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2 bg-transparent"><Share2 size={20}/>مشاركة</Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">الوصف</TabsTrigger>
              <TabsTrigger value="notes">النوتات</TabsTrigger>
              <TabsTrigger value="reviews">التقييمات</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 bg-secondary rounded-lg">
              <p className="text-lg text-foreground leading-relaxed mb-4">{product.fullDescription}</p>
              <p className="text-muted-foreground">هذا العطر مناسب للاستخدام اليومي والمناسبات الخاصة. يتميز برائحة فاخرة تدوم طويلاً وانتشار قوي.</p>
            </TabsContent>

            <TabsContent value="notes" className="p-6 bg-secondary rounded-lg">
              <div className="flex flex-wrap gap-3">
                {product.notes.map((note) => (
                  <span key={note} className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm">{note}</span>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 bg-secondary rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div><h4 className="font-semibold text-primary">{review.author}</h4><p className="text-sm text-muted-foreground">{review.date}</p></div>
                    <div className="flex gap-1">{[...Array(review.rating)].map((_, i) => (<Star key={i} size={16} fill="currentColor" className="text-accent"/>))}</div>
                  </div>
                  <h5 className="font-semibold text-foreground mb-2">{review.title}</h5>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <section>
            <h2 className="text-3xl font-bold text-primary mb-8">منتجات ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="h-48 bg-secondary overflow-hidden">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-primary mb-2">{item.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-accent">{item.price} ر.س</span>
                        <div className="flex gap-1">{[...Array(item.rating)].map((_, i) => (<Star key={i} size={14} fill="currentColor" className="text-accent"/>))}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
