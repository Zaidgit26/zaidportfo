"use client"

import { useEffect, useState, useCallback, useRef } from 'react'

interface MobileNavPerformance {
  fps: number
  isLowEnd: boolean
  isMobile: boolean
  shouldReduceMotion: boolean
  animationDuration: number
  blurIntensity: string
}

export function useMobileNavigationPerformance() {
  const [performanceState, setPerformanceState] = useState<MobileNavPerformance>({
    fps: 60,
    isLowEnd: false,
    isMobile: false,
    shouldReduceMotion: false,
    animationDuration: 300,
    blurIntensity: 'blur(20px)'
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(typeof window !== 'undefined' && window.performance ? window.performance.now() : Date.now())
  const fpsHistoryRef = useRef<number[]>([])

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const isMobile = window.innerWidth < 768
    const cores = navigator.hardwareConcurrency || 4
    const isLowEnd = cores <= 4 || isMobile
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Adjust performance settings based on device
    const animationDuration = isLowEnd ? 200 : shouldReduceMotion ? 0 : 300
    const blurIntensity = isLowEnd ? 'blur(8px)' : isMobile ? 'blur(12px)' : 'blur(20px)'

    setPerformanceState(prev => ({
      ...prev,
      isMobile,
      isLowEnd,
      shouldReduceMotion,
      animationDuration,
      blurIntensity
    }))
  }, [])

  // Monitor FPS during navigation animations
  const measureFPS = useCallback(() => {
    let animationFrameId: number

    const measure = (currentTime: number) => {
      frameCountRef.current++
      const deltaTime = currentTime - lastTimeRef.current

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
        
        // Keep FPS history for smoothing
        fpsHistoryRef.current.push(fps)
        if (fpsHistoryRef.current.length > 5) {
          fpsHistoryRef.current.shift()
        }

        const averageFps = Math.round(
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
        )

        setPerformanceState(prev => ({ ...prev, fps: averageFps }))

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      animationFrameId = requestAnimationFrame(measure)
    }

    animationFrameId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Optimize navigation based on performance
  const getOptimizedSettings = useCallback(() => {
    const { fps, isLowEnd, shouldReduceMotion, isMobile } = performanceState

    // Reduce complexity if FPS drops below 45
    const isPerformancePoor = fps < 45

    return {
      // Animation settings
      enableSpringAnimations: !isLowEnd && !shouldReduceMotion && !isPerformancePoor,
      enableStaggeredAnimations: !isLowEnd && !isPerformancePoor,
      enableHoverEffects: !isMobile && !isPerformancePoor,

      // Visual settings
      backdropBlur: isPerformancePoor ? 'blur(4px)' : performanceState.blurIntensity,
      shadowIntensity: isPerformancePoor ? 'shadow-lg' : 'shadow-2xl',

      // Timing settings
      animationDuration: shouldReduceMotion ? 0 : isPerformancePoor ? 150 : performanceState.animationDuration,
      staggerDelay: isPerformancePoor ? 50 : 100,

      // Hardware acceleration hints
      useHardwareAcceleration: true,
      optimizeForTouch: isMobile
    }
  }, [performanceState])

  // Apply performance optimizations to DOM
  const applyPerformanceOptimizations = useCallback(() => {
    const settings = getOptimizedSettings()
    
    // Add performance classes to body
    document.body.classList.toggle('mobile-nav-low-end', performanceState.isLowEnd)
    document.body.classList.toggle('mobile-nav-reduced-motion', performanceState.shouldReduceMotion)
    document.body.classList.toggle('mobile-nav-poor-performance', performanceState.fps < 45)

    // Set CSS custom properties for dynamic optimization
    document.documentElement.style.setProperty('--mobile-nav-duration', `${settings.animationDuration}ms`)
    document.documentElement.style.setProperty('--mobile-nav-backdrop-blur', settings.backdropBlur)
    document.documentElement.style.setProperty('--mobile-nav-stagger-delay', `${settings.staggerDelay}ms`)
  }, [performanceState, getOptimizedSettings])

  // Preload critical resources
  const preloadResources = useCallback(() => {
    // Preload fonts that might be used in navigation
    const fontPreload = document.createElement('link')
    fontPreload.rel = 'preload'
    fontPreload.as = 'font'
    fontPreload.type = 'font/woff2'
    fontPreload.crossOrigin = 'anonymous'
    
    // Hint browser about upcoming animations
    const animationHint = document.createElement('meta')
    animationHint.name = 'viewport'
    animationHint.content = 'width=device-width, initial-scale=1, viewport-fit=cover'
    
    if (!document.querySelector('meta[name="viewport"]')) {
      document.head.appendChild(animationHint)
    }
  }, [])

  // Initialize performance monitoring
  useEffect(() => {
    detectDeviceCapabilities()
    preloadResources()
    
    const cleanup = measureFPS()
    
    // Listen for viewport changes
    const handleResize = () => {
      detectDeviceCapabilities()
    }
    
    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      detectDeviceCapabilities()
    }
    
    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleMotionChange)
    
    return () => {
      cleanup()
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [detectDeviceCapabilities, measureFPS, preloadResources])

  // Apply optimizations when performance changes
  useEffect(() => {
    applyPerformanceOptimizations()
  }, [applyPerformanceOptimizations])

  return {
    performance: performanceState,
    optimizedSettings: getOptimizedSettings(),

    // Utility functions
    shouldUseReducedMotion: () => performanceState.shouldReduceMotion || performanceState.fps < 30,
    shouldUseHardwareAcceleration: () => !performanceState.isLowEnd,
    getAnimationDuration: (baseMs: number) => performanceState.shouldReduceMotion ? 0 :
      performanceState.fps < 45 ? Math.min(baseMs * 0.7, 200) : baseMs,

    // Performance monitoring
    isPerformanceGood: () => performanceState.fps >= 55,
    isPerformanceFair: () => performanceState.fps >= 30 && performanceState.fps < 55,
    isPerformancePoor: () => performanceState.fps < 30
  }
}
