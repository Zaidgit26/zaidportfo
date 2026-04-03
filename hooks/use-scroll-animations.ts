"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAnimation } from 'framer-motion'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  triggerOnce?: boolean
}

interface ScrollAnimationState {
  isVisible: boolean
  hasTriggered: boolean
  progress: number
  direction: 'up' | 'down'
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '-10%',
    once = true,
    triggerOnce = true
  } = options

  const ref = useRef<HTMLElement>(null)
  const controls = useAnimation()
  const [state, setState] = useState<ScrollAnimationState>({
    isVisible: false,
    hasTriggered: false,
    progress: 0,
    direction: 'down'
  })

  const lastScrollY = useRef(0)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    const currentScrollY = window.scrollY
    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
    lastScrollY.current = currentScrollY

    const isVisible = entry.isIntersecting
    const progress = Math.min(1, Math.max(0, entry.intersectionRatio))

    setState(prev => ({
      ...prev,
      isVisible,
      progress,
      direction,
      hasTriggered: prev.hasTriggered || isVisible
    }))

    if (isVisible && (!triggerOnce || !state.hasTriggered)) {
      controls.start('visible')
    } else if (!isVisible && !once) {
      controls.start('hidden')
    }
  }, [controls, once, triggerOnce, state.hasTriggered])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: Array.isArray(threshold) ? threshold : [threshold],
      rootMargin
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [handleIntersection, threshold, rootMargin])

  return {
    ref,
    controls,
    ...state
  }
}

// Hook for parallax scrolling effects
export function useParallaxScroll(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateOffset = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      setOffset(rate)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateOffset)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateOffset() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return { ref, offset }
}

// Hook for scroll progress tracking
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      
      setProgress(Math.min(1, Math.max(0, scrollPercent)))
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return progress
}

// Hook for element visibility with enhanced performance
export function useElementVisibility(options: {
  threshold?: number
  rootMargin?: string
  once?: boolean
} = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, hasBeenVisible])

  return {
    ref,
    isVisible: once ? hasBeenVisible : isVisible,
    hasBeenVisible
  }
}

// Hook for smooth reveal animations on scroll
export function useSmoothReveal(delay: number = 0) {
  const { ref, isVisible } = useElementVisibility({
    threshold: 0.1,
    rootMargin: '-50px',
    once: true
  })

  const controls = useAnimation()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        controls.start('visible')
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, controls, delay])

  return { ref, controls, isVisible }
}

// Hook for staggered animations
export function useStaggeredAnimation(itemCount: number, staggerDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false))
  const { ref, isVisible } = useElementVisibility({
    threshold: 0.1,
    rootMargin: '-20px',
    once: true
  })

  useEffect(() => {
    if (isVisible) {
      // Stagger the animation of items
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev]
            newState[i] = true
            return newState
          })
        }, i * staggerDelay)
      }
    }
  }, [isVisible, itemCount, staggerDelay])

  return { ref, visibleItems, isVisible }
}
