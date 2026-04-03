"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { smoothScrollTo } from '@/components/smooth-scroll-provider'

interface NavigationState {
  activeSection: string
  isScrolling: boolean
  scrollDirection: 'up' | 'down'
  scrollProgress: number
}

interface NavigationOptions {
  offset?: number
  duration?: number
  threshold?: number
  rootMargin?: string
}

export function useEnhancedNavigation(options: NavigationOptions = {}) {
  const {
    offset = -80,
    duration = 1.2,
    threshold = 0.5,
    rootMargin = '-20%'
  } = options

  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeSection: 'home',
    isScrolling: false,
    scrollDirection: 'down',
    scrollProgress: 0
  })

  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout>()
  const observerRef = useRef<IntersectionObserver>()

  // Enhanced smooth scroll with momentum and easing
  const navigateToSection = useCallback((sectionId: string, customOptions?: Partial<NavigationOptions>) => {
    const finalOptions = { ...options, ...customOptions }
    
    setNavigationState(prev => ({ ...prev, isScrolling: true }))
    
    // Clear any existing scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Use Lenis for buttery smooth scrolling
    smoothScrollTo(`#${sectionId}`, {
      offset: finalOptions.offset,
      duration: finalOptions.duration
    })

    // Reset scrolling state after animation completes
    scrollTimeout.current = setTimeout(() => {
      setNavigationState(prev => ({ ...prev, isScrolling: false }))
    }, (finalOptions.duration || duration) * 1000 + 100)
  }, [options, duration])

  // Track scroll progress and direction
  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY
    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = Math.min(1, Math.max(0, currentScrollY / documentHeight))

    setNavigationState(prev => ({
      ...prev,
      scrollDirection: direction,
      scrollProgress: progress
    }))

    lastScrollY.current = currentScrollY
  }, [])

  // Optimized scroll handler with RAF
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScrollState])

  // Enhanced intersection observer for section detection
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    
    if (sections.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the section with the highest intersection ratio
        let maxRatio = 0
        let activeSection = navigationState.activeSection

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            activeSection = entry.target.id
          }
        })

        // Only update if we have a significant intersection and we're not currently scrolling
        if (maxRatio > threshold && !navigationState.isScrolling) {
          setNavigationState(prev => ({
            ...prev,
            activeSection
          }))
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin
      }
    )

    sections.forEach(section => {
      observerRef.current?.observe(section)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin, navigationState.isScrolling])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) return

      const sections = Array.from(document.querySelectorAll('section[id]')).map(s => s.id)
      const currentIndex = sections.indexOf(navigationState.activeSection)

      switch (event.key) {
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1])
          }
          break
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1])
          }
          break
        case 'Home':
          event.preventDefault()
          navigateToSection(sections[0])
          break
        case 'End':
          event.preventDefault()
          navigateToSection(sections[sections.length - 1])
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigationState.activeSection, navigateToSection])

  // Navigation history support
  const navigateWithHistory = useCallback((sectionId: string, updateHistory = true) => {
    navigateToSection(sectionId)
    
    if (updateHistory && window.history.pushState) {
      const newUrl = `${window.location.pathname}#${sectionId}`
      window.history.pushState({ section: sectionId }, '', newUrl)
    }
  }, [navigateToSection])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const hash = window.location.hash.slice(1)
      if (hash && hash !== navigationState.activeSection) {
        navigateToSection(hash)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigationState.activeSection, navigateToSection])

  // Get all available sections
  const getAvailableSections = useCallback(() => {
    return Array.from(document.querySelectorAll('section[id]')).map(section => ({
      id: section.id,
      element: section as HTMLElement,
      title: section.getAttribute('data-title') || section.id
    }))
  }, [])

  // Get next/previous sections
  const getAdjacentSections = useCallback(() => {
    const sections = getAvailableSections()
    const currentIndex = sections.findIndex(s => s.id === navigationState.activeSection)
    
    return {
      previous: currentIndex > 0 ? sections[currentIndex - 1] : null,
      next: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
    }
  }, [navigationState.activeSection, getAvailableSections])

  return {
    // State
    ...navigationState,
    
    // Navigation functions
    navigateToSection,
    navigateWithHistory,
    
    // Utility functions
    getAvailableSections,
    getAdjacentSections,
    
    // Convenience functions
    goToNext: () => {
      const { next } = getAdjacentSections()
      if (next) navigateToSection(next.id)
    },
    
    goToPrevious: () => {
      const { previous } = getAdjacentSections()
      if (previous) navigateToSection(previous.id)
    },
    
    goToTop: () => navigateToSection('home'),
    
    // Check functions
    isActive: (sectionId: string) => navigationState.activeSection === sectionId,
    canGoNext: () => getAdjacentSections().next !== null,
    canGoPrevious: () => getAdjacentSections().previous !== null
  }
}
