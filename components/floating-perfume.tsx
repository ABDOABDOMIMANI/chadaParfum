"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function FloatingPerfume() {
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const perfumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setWindowHeight(window.innerHeight)
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    setWindowHeight(window.innerHeight)
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calculate position and rotation based on scroll
  const calculateTransform = () => {
    if (windowHeight === 0) {
      return {
        top: "20%",
        right: "10%",
        transform: "translateY(0) rotate(0deg) scale(1)",
        opacity: 1,
      }
    }

    // Calculate progress through the page (0 to 1)
    const maxScroll = windowHeight * 3 // Approximate total scroll height
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll))

    // Smooth transitions between positions
    if (progress < 0.33) {
      // Hero section - top right, moving down and rotating
      const sectionProgress = progress / 0.33
      const rotate = sectionProgress * 180
      const scale = 1 - sectionProgress * 0.3
      const translateY = sectionProgress * 100
      return {
        top: `${20 + sectionProgress * 30}%`,
        right: `${10 - sectionProgress * 40}%`,
        transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
        opacity: Math.max(0.3, 1 - sectionProgress * 0.4),
      }
    } else if (progress < 0.66) {
      // Products section - center, rotating
      const sectionProgress = (progress - 0.33) / 0.33
      const rotate = 180 + sectionProgress * 15
      const scale = 0.7 + sectionProgress * 0.3
      return {
        top: "50%",
        right: "50%",
        transform: `translate(50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        opacity: Math.max(0.3, 0.6 + sectionProgress * 0.4),
      }
    } else {
      // Quotes section - bottom right, moving up
      const sectionProgress = (progress - 0.66) / 0.34
      const rotate = 195 + sectionProgress * 15
      const scale = 1 - sectionProgress * 0.3
      const translateX = 50 - sectionProgress * 50
      const translateY = -50 + sectionProgress * 50
      return {
        top: `${50 + sectionProgress * 30}%`,
        right: `${50 - sectionProgress * 40}%`,
        transform: `translate(${translateX}%, ${translateY}%) rotate(${rotate}deg) scale(${scale})`,
        opacity: Math.max(0.3, 1 - sectionProgress * 0.5),
      }
    }
  }

  const transform = calculateTransform()

  return (
    <>
      <div
        ref={perfumeRef}
        className="fixed z-30 pointer-events-none transition-all duration-700 ease-in-out hidden md:block"
        style={{
          top: transform.top,
          right: transform.right,
          transform: transform.transform,
          opacity: Math.max(0.3, transform.opacity),
        }}
      >
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full">
            <Image
              src="/chada-logo.png"
              alt="عطر الشذى"
              fill
              className="object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 10px 30px rgba(212, 175, 55, 0.3))",
              }}
              priority
            />
          </div>
        </div>
      </div>
    </>
  )
}

