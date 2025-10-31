"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Star, Search, SlidersHorizontal } from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Shop() {
  const perfumes = [
    {
      id: 1,
      name: "عطر الياسمين الملكي",
      price: 280,
      rating: 5,
      category: "цветي",
      image: "/luxury-jasmine-perfume.jpg",
    },
    {
      id: 2,
      name: "عطر الزعفران الشرقي",
      price: 320,
      rating: 5,
      category: "شرقي",
      image: "/luxury-saffron-perfume.jpg",
    },
    { id: 3, name: "عطر الورد الدمشقي", price: 250, rating: 4, category: "цветي", image: "/luxury-rose-perfume.jpg" },
    { id: 4, name: "عطر المسك الأسود", price: 300, rating: 5, category: "شرقي", image: "/luxury-musk-perfume.jpg" },
    {
      id: 5,
      name: "عطر الفانيليا الذهبية",
      price: 270,
      rating: 4,
      category: "عطري",
      image: "/luxury-vanilla-perfume.jpg",
    },
    { id: 6, name: "عطر العود الفاخر", price: 380, rating: 5, category: "شرقي", image: "/luxury-oud-perfume.jpg" },
    {
      id: 7,
      name: "عطر الزهور الربيعية",
      price: 200,
      rating: 4,
      category: "цветي",
      image: "/luxury-floral-perfume.jpg",
    },
    {
      id: 8,
      name: "عطر الصندل الدافئ",
      price: 290,
      rating: 4,
      category: "خشبي",
      image: "/luxury-sandalwood-perfume.jpg",
    },
    { id: 9, name: "عطر الليمون الحمضي", price: 220, rating: 5, category: "حمضي", image: "/luxury-citrus-perfume.jpg" },
    {
      id: 10,
      name: "عطر الكهرمان القديم",
      price: 310,
      rating: 4,
      category: "شرقي",
      image: "/luxury-amber-perfume.jpg",
    },
    {
      id: 11,
      name: "عطر البخور الفاخر",
      price: 340,
      rating: 5,
      category: "خشبي",
      image: "/luxury-incense-perfume.jpg",
    },
    {
      id: 12,
      name: "عطر الياسمين الليلي",
      price: 295,
      rating: 5,
      category: "цветي",
      image: "/luxury-night-jasmine.jpg",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedPerfumes = useMemo(() => {
    const result = perfumes.filter((perfume) => {
      const matchesSearch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || perfume.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Apply sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [searchTerm, selectedCategory, sortBy])

  const categories = ["all", ...new Set(perfumes.map((p) => p.category))]

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">متجرنا</h1>
            <p className="text-lg text-muted-foreground">اكتشف مجموعتنا الكاملة من العطور الفاخرة</p>
          </div>

          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="ابحث عن عطر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-base"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <SlidersHorizontal size={16} />
                تصفية
              </Button>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">مختاره</SelectItem>
                  <SelectItem value="price-low">السعر: منخفض</SelectItem>
                  <SelectItem value="price-high">السعر: مرتفع</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>

              {/* Result Count */}
              <span className="text-sm text-muted-foreground mr-auto">{filteredAndSortedPerfumes.length} نتيجة</span>
            </div>

            {showFilters && (
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground mb-3">الفئات</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground border border-border hover:bg-muted"
                      }`}
                    >
                      {cat === "all" ? "الكل" : cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* No results message */}
          {filteredAndSortedPerfumes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">لم يتم العثور على عطور تطابق البحث</p>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-48 bg-secondary">
                  <img
                    src={perfume.image || "/placeholder.svg?height=192&width=192&query=luxury perfume bottle"}
                    alt={perfume.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    جديد
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">{perfume.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{perfume.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-accent">{perfume.price} ر.س</span>
                    <div className="flex gap-0.5">
                      {[...Array(perfume.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="text-accent" />
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/product/${perfume.id}`}
                    className="block w-full text-center py-2 bg-primary text-primary-foreground rounded hover:bg-accent transition-colors text-sm font-medium"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
