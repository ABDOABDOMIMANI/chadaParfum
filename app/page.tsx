"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsSlider } from "@/components/products-slider"
import { PromotionsSlider } from "@/components/promotions-slider"
import Link from "next/link"
import { Star, Zap, Quote, Sparkles, ArrowRight, Award, Truck, Shield, Heart, Gift } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
const quotes = [
  {
    text: "العطر هو الذاكرة التي لا تُنسى، هو الإحساس الذي يبقى بعد أن نذهب",
    author: "كوكو شانيل",
  },
  {
    text: "العطر هو أناقة خفية لا تُرى، لكنها تُشعر بها وتُذكر بها",
    author: "كريستيان ديور",
  },
  {
    text: "العطر الفاخر هو فن يحول اللحظة العادية إلى لحظة استثنائية",
    author: "إيستر لودر",
  },
  {
    text: "العطر الصحيح يجعلك تشعر بالثقة والجمال من الداخل",
    author: "إيف سان لوران",
  },
]

export default function Home() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Generate fixed random positions and animations for particles (only once)
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${10 + Math.random() * 10}s`,
    }))
  }, [])

  useEffect(() => {
    setIsVisible(true)
    // Change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(quoteInterval)
  }, [])

  const currentQuote = quotes[currentQuoteIndex]


  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section with Interactive Animations */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground min-h-screen flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>

          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('/old-fashioned-table-setting-with-antique-metal-decorations-generated-by-ai.jpg')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content with Animations */}
              <div className={`space-y-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                
                <div className="space-y-2">
                  <h2 className="text-7xl sm:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent animate-gradient bg-[length:200%_auto]">
                    الشذى
                  </h2> 
                  <p className="text-3xl sm:text-4xl font-bold text-accent animate-slide-in-right">
                    البخور والعطور الأصلية
                  </p>
                </div>

                <p className="text-xl sm:text-2xl opacity-90 leading-relaxed max-w-2xl animate-fade-in-delay">
                  اكتشف عالماً من العطور الفاخرة، مزيج فريد من التقاليد الشرقية والفن الحديث. كل زجاجة تحكي قصة عطر لا تُنسى
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center justify-center px-10 py-4 bg-accent text-accent-foreground rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent/50"
                  >
                    <span>تسوق الآن</span>
                    <ArrowRight className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-10 py-4 border-2 border-accent/50 text-accent rounded-xl font-bold text-lg hover:bg-accent/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    عن المتجر
                  </Link>
                </div>
              </div>

              {/* Logo with 3D Animation */}
              <div className="hidden lg:flex justify-center items-center h-full animate-float-3d">
                <div className="relative w-96 h-96">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="relative transform-gpu hover:scale-110 transition-transform duration-500">
                      <Image
                        src="/chada-logo.png"
                        alt="شعار الشذى"
                        width={384}
                        height={384}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Particles Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float-particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.animationDelay,
                  animationDuration: particle.animationDuration,
                }}
              ></div>
            ))}
          </div>
        </section>

        {/* Promotions Section */}
        <PromotionsSlider autoSlide={true} autoSlideInterval={5000} />

        {/* Products Slider Section */}
        <ProductsSlider limit={8} autoSlide={true} autoSlideInterval={5000} />

        {/* Quotes Carousel Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background">
          <div className="max-w-4xl mx-auto">
            <div
              key={currentQuoteIndex}
              className="text-center space-y-6 animate-fade-in-quote"
            >
              <Quote className="w-16 h-16 mx-auto text-primary/30 animate-quote-icon" />
              <blockquote className="text-3xl sm:text-4xl font-bold text-foreground leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              <p className="text-xl text-muted-foreground font-semibold">— {currentQuote.author}</p>
              
              {/* Quote Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {quotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuoteIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentQuoteIndex
                        ? "bg-primary w-8"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Quote ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-delay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slide-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float-3d {
            0%, 100% {
              transform: translateY(0px) rotateY(0deg);
            }
            50% {
              transform: translateY(-20px) rotateY(5deg);
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.1);
            }
          }

          @keyframes float-particle {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) translateX(50px);
              opacity: 0;
            }
          }

          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes quote-icon {
            0%, 100% {
              transform: scale(1) rotate(0deg);
            }
            50% {
              transform: scale(1.1) rotate(5deg);
            }
          }

          @keyframes fade-in-quote {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }

          .animate-fade-in-delay {
            animation: fade-in-delay 1s ease-out 0.3s both;
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.8s ease-out 0.2s both;
          }

          .animate-slide-in-up {
            animation: slide-in-up 0.8s ease-out 0.4s both;
          }

          .animate-float-3d {
            animation: float-3d 6s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }

          .animate-float-particle {
            animation: float-particle linear infinite;
          }

          .animate-gradient {
            animation: gradient 5s ease infinite;
          }

          .animate-sparkle {
            animation: sparkle 2s ease-in-out infinite;
          }

          .animate-shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.1) 100%
            );
            background-size: 200% auto;
            animation: shimmer 3s linear infinite;
          }

          .animate-quote-icon {
            animation: quote-icon 3s ease-in-out infinite;
          }

          .animate-fade-in-quote {
            animation: fade-in-quote 0.6s ease-out;
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
