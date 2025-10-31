"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Star, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const featuredPerfumes = [
    {
      id: 1,
      name: "عطر الياسمين الملكي",
      arabicTag: "الياسمين",
      description: "مزيج فاخر من الياسمين والورد الدمشقي",
      price: 280,
      originalPrice: 350,
      rating: 5,
      image: "/black-bottle-alcohol-beverage-table.png",
      discount: 20,
    },
    {
      id: 2,
      name: "عطر الزعفران الشرقي",
      arabicTag: "شرقي",
      description: "عطر شرقي أصيل بنكهات ذهبية دافئة",
      price: 320,
      originalPrice: 400,
      rating: 5,
      image: "/luxury-saffron-perfume-bottle-oriental.jpg",
      discount: 20,
    },
    {
      id: 3,
      name: "عطر الورد الدمشقي",
      arabicTag: "الورد",
      description: "وردة دمشقية خالصة مع مسك فاخر",
      price: 250,
      originalPrice: 300,
      rating: 4,
      image: "/luxury-damascus-rose-perfume-bottle.jpg",
      discount: 17,
    },
  ]

  const allProducts = [
    {
      id: 1,
      name: "عطر الياسمين الملكي",
      price: 280,
      rating: 5,
      image: "/luxury-jasmine-perfume-bottle-elegant.jpg",
    },
    {
      id: 2,
      name: "عطر الزعفران الشرقي",
      price: 320,
      rating: 5,
      image: "/luxury-saffron-perfume-bottle-oriental.jpg",
    },
    {
      id: 3,
      name: "عطر الورد الدمشقي",
      price: 250,
      rating: 4,
      image: "/luxury-damascus-rose-perfume-bottle.jpg",
    },
    {
      id: 4,
      name: "عطر الأود الفاخر",
      price: 420,
      rating: 5,
      image: "/luxury-oud-perfume-bottle-premium.jpg",
    },
    {
      id: 5,
      name: "عطر المسك الذهبي",
      price: 380,
      rating: 5,
      image: "/luxury-musk-perfume-bottle-golden.jpg",
    },
    {
      id: 6,
      name: "عطر البخور الأصيل",
      price: 200,
      rating: 4,
      image: "/luxury-bakhoor-perfume-bottle-authentic.jpg",
    },
  ]

  const features = [
    { icon: "🚚", title: "شحن سريع", description: "توصيل إلى جميع أنحاء المملكة" },
    { icon: "🔒", title: "دفع آمن", description: "عمليات دفع محمية 100%" },
    { icon: "✨", title: "منتجات أصلية", description: "جميع العطور مضمونة وأصلية" },
  ]

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section with Logo */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground ">
  <div
    className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat rounded-2xl h-[700px] overflow-hidden"
    style={{
      backgroundImage:
        "url('/old-fashioned-table-setting-with-antique-metal-decorations-generated-by-ai.jpg')",
    }}
  >
    {/* Blur overlay */}
    <div className="absolute inset-0 bg-black/10 backdrop-blur-30"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full relative z-10">
      {/* Text Content */}
      <div className="animate-slideInLeft">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-bold tracking-wider">
            عروض حصرية
          </span>
        </div>
        <h1 className="text-6xl sm:text-7xl font-black mb-4 text-pretty">الشذى</h1>
        <p className="text-2xl mb-2 font-bold text-accent">البخور والعطور الأصلية</p>
        <p className="text-lg opacity-90 mb-8 leading-relaxed">
          اكتشف عالماً من العطور الفاخرة، مزيج فريد من التقاليد الشرقية والفن الحديث. كل زجاجة تحكي قصة عطر لا تُنسى
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-base"
          >
            تسوق الآن
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent text-accent rounded-lg font-bold hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            عن المتجر
          </Link>
        </div>
      </div>

      <div className="animate-float hidden md:flex justify-center items-center h-full">
        <div className="relative w-72 h-80">
          <div className="absolute inset-0 bg-accent opacity-15 rounded-full blur-3xl animate-pulse"></div>
          <Image
            src="/chada-logo.png"
            alt="شعار الشذى"
            width={288}
            height={288}
            className="relative z-10 w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  </div>

  {/* Decorative background elements */}
  <div className="absolute -left-40 w-100 h-100 bg-accent opacity-5 rounded-full blur-3xl"></div>
  <div className="absolute -right-40 bottom-0 w-80 h-80 bg-accent opacity-5 rounded-full blur-3xl"></div>
</section>
    
        {/* Today's Deal Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between bg-card rounded-2xl p-8 sm:p-12 shadow-lg">
              <div className="md:w-1/2 mb-8 md:mb-0 animate-slideInLeft">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-accent font-bold text-sm uppercase">عرض اليوم</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-3">{featuredPerfumes[0].name}</h3>
                <p className="text-foreground mb-6 text-lg">{featuredPerfumes[0].description}</p>

                {/* Pricing */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-accent">{featuredPerfumes[0].price} ر.س</span>
                  <span className="text-xl line-through text-muted-foreground">
                    {featuredPerfumes[0].originalPrice} ر.س
                  </span>
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full font-bold">
                    -{featuredPerfumes[0].discount}%
                  </span>
                </div>

                {/* Countdown Timer */}
                <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-8 inline-block">
                  <p className="text-sm font-semibold mb-3">ينتهي العرض في:</p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
                      <div className="text-xs">ساعات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
                      <div className="text-xs">دقائق</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
                      <div className="text-xs">ثوان</div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/product/${featuredPerfumes[0].id}`}
                  className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  اشتر الآن
                </Link>
              </div>

              {/* Product Image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-130 h-96 animate-rotateZ">
                  <div className="absolute inset-0 bg-accent opacity-10 rounded-full blur-3xl animate-pulse"></div>
                  <img
                    src={
                      featuredPerfumes[0].image ||
                      "/placeholder.svg?height=384&width=256&query=luxury%20perfume%20bottle" ||
                      "/placeholder.svg"
                    }
                    alt={featuredPerfumes[0].name}
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>

                {/* 🌸 Scoped animation style */}
                <style jsx>{`
                  @keyframes rotateZmotion {
                    0% {
                      transform: rotateZ(0deg) scale(1);
                    }
                    25% {
                      transform: rotateZ(8deg) scale(1.05);
                    }
                    50% {
                      transform: rotateZ(0deg) scale(1);
                    }
                    75% {
                      transform: rotateZ(-3deg) scale(1.05);
                    }
                    100% {
                      transform: rotateZ(0deg) scale(1);
                    }
                  }

                  .animate-rotateZ {
                    animation: rotateZmotion 4s ease-in-out infinite;
                    transform-style: preserve-3d;
                  }
                `}</style>
              </div>




            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار الشذى؟</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-lg bg-primary-foreground text-primary animate-scaleIn"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* 🌸 The icon/image with zoom animation */}
                    <div className="text-4xl mb-4 zoom-animate">{feature.icon}</div>

                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="opacity-75">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔮 Zoom animation style */}
            <style jsx>{`
              @keyframes zoomInOut {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.15);
                }
                100% {
                  transform: scale(1);
                }
              }

              .zoom-animate {
                display: inline-block;
                animation: zoomInOut 3s ease-in-out infinite;
              }
            `}</style>
          </section>

        {/* New Arrivals Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-border"></div>
              <h2 className="text-3xl font-bold text-primary px-6">المنتجات الجديدة</h2>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            <p className="text-center text-muted-foreground mb-12">أحدث إضافات لمجموعتنا الفاخرة</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden h-72 bg-secondary">
                    <img
                      src={product.image || "/placeholder.svg?height=288&width=256&query=luxury%20perfume"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-2 text-pretty">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-accent">{product.price} ر.س</span>
                      <div className="flex gap-0.5">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" className="text-accent" />
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all transform hover:scale-105"
              >
                عرض جميع المنتجات
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">اشترك بنشرتنا البريدية</h2>
            <p className="text-lg opacity-90 mb-8">احصل على أحدث العروض والمنتجات الجديدة مباشرة إلى بريدك</p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105">
                اشترك
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
