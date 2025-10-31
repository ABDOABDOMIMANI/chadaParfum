"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/chada-logo.png"
                alt="الشذى للعطور"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-primary font-tinta">الشذى</div>
              <div className="text-xs text-muted-foreground font-tinta">البخور والعطور الأصلية</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium font-tinta"
            >
              الرئيسية
            </Link>
            <Link
              href="/shop"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium font-tinta"
            >
              المتجر
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium font-tinta"
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium font-tinta"
            >
              اتصل بنا
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/" className="block py-2 text-foreground hover:text-primary transition-colors font-tinta">
              الرئيسية
            </Link>
            <Link href="/shop" className="block py-2 text-foreground hover:text-primary transition-colors font-tinta">
              المتجر
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary transition-colors font-tinta">
              من نحن
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-foreground hover:text-primary transition-colors font-tinta"
            >
              اتصل بنا
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
