"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load cart count
  useEffect(() => {
    const loadCartCount = () => {
      if (typeof window !== "undefined") {
        const cart = JSON.parse(localStorage.getItem("chada_cart") || "[]")
        const count = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
        setCartCount(count)
      }
    }

    loadCartCount()
    window.addEventListener("storage", loadCartCount)
    return () => window.removeEventListener("storage", loadCartCount)
  }, [])

  // Determine header background based on page and scroll
  const getHeaderBg = () => {
    if (isHomePage) {
      return scrolled ? "bg-primary/95 backdrop-blur-md" : "bg-transparent"
    }
    return "bg-primary/95 backdrop-blur-md"
  }

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl shadow-lg transition-all duration-500 ${getHeaderBg()}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/chada-logo.png"
                alt="الشذى للعطور"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-white font-tinta">رواق الشذى</div>
              <div className="text-sm text-white/80 font-tinta">للبخور والعطور الأصلية</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-xl text-white hover:text-white/80 transition-colors font-medium font-tinta"
            >
              الرئيسية
            </Link>
            <Link
              href="/shop"
              className="text-xl text-white hover:text-white/80 transition-colors font-medium font-tinta"
            >
              المتجر
            </Link>
            <Link
              href="/about"
              className="text-xl text-white hover:text-white/80 transition-colors font-medium font-tinta"
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              className="text-xl text-white hover:text-white/80 transition-colors font-medium font-tinta"
            >
              اتصل بنا
            </Link>
            <Link
              href="/cart"
              className="relative text-xl text-white hover:text-white/80 transition-colors font-medium font-tinta flex items-center gap-2"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link href="/" className="block py-2 text-lg text-white hover:text-white/80 transition-colors font-tinta">
              الرئيسية
            </Link>
            <Link href="/shop" className="block py-2 text-lg text-white hover:text-white/80 transition-colors font-tinta">
              المتجر
            </Link>
            <Link href="/about" className="block py-2 text-lg text-white hover:text-white/80 transition-colors font-tinta">
              من نحن
            </Link>
            <Link href="/contact" className="block py-2 text-lg text-white hover:text-white/80 transition-colors font-tinta">
              اتصل بنا
            </Link>
            <Link
              href="/cart"
              className="block py-2 text-lg text-white hover:text-white/80 transition-colors font-tinta flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              السلة
              {cartCount > 0 && (
                <span className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
