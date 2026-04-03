"use client"

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with optimized settings for buttery smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for ultra-smooth feel
      direction: 'vertical', // Vertical scrolling
      gestureDirection: 'vertical', // Gesture direction
      smooth: true,
      mouseMultiplier: 1, // Mouse wheel sensitivity
      smoothTouch: false, // Disable smooth scrolling on touch devices for better performance
      touchMultiplier: 2, // Touch sensitivity
      infinite: false, // No infinite scroll
      autoResize: true, // Auto resize on window resize
      syncTouch: false, // Don't sync touch events
      syncTouchLerp: 0.075, // Touch lerp value
      touchInertiaMultiplier: 35, // Touch inertia
      wheelMultiplier: 1, // Wheel multiplier
      normalizeWheel: true, // Normalize wheel events
    })

    // Animation loop for smooth scrolling
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  // Expose Lenis instance globally for navigation
  useEffect(() => {
    if (lenisRef.current) {
      // Make Lenis instance available globally
      ;(window as any).lenis = lenisRef.current
    }
  }, [])

  return <>{children}</>
}

// Hook to access Lenis instance
export function useLenis() {
  return (window as any).lenis as Lenis | undefined
}

// Utility function for smooth scrolling to elements
export function smoothScrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
  const lenis = (window as any).lenis as Lenis | undefined
  if (!lenis) return

  const offset = options?.offset ?? -80 // Default offset for navbar
  const duration = options?.duration ?? 1.2

  if (typeof target === 'string') {
    const element = document.querySelector(target) as HTMLElement
    if (element) {
      lenis.scrollTo(element, {
        offset,
        duration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    }
  } else {
    lenis.scrollTo(target, {
      offset,
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
  }
}
