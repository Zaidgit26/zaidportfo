"use client"

import { useState, useEffect } from "react"

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "experience", "contact"]
      const sectionElements = sections.map(id => document.getElementById(id))
      
      // Find the section that's most visible in the viewport
      let currentSection = "home"
      let maxVisibility = 0
      
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          
          // Calculate how much of the section is visible
          const visibleTop = Math.max(0, -rect.top)
          const visibleBottom = Math.min(rect.height, viewportHeight - rect.top)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibility = visibleHeight / viewportHeight
          
          if (visibility > maxVisibility) {
            maxVisibility = visibility
            currentSection = sections[index]
          }
        }
      })
      
      setActiveSection(currentSection)
    }

    // Set initial section
    handleScroll()
    
    // Add scroll listener with throttling
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
    }
  }, [])

  return activeSection
}
