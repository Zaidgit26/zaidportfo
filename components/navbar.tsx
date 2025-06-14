"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ChevronRight, User, Code, FolderOpen, Briefcase, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showNav, setShowNav] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      setShowNav(true)
      setScrolled(window.scrollY > 10)

      const sections = document.querySelectorAll("section[id]")

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    setShowNav(true)
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      // Close mobile menu if open
      setIsOpen(false)

      // Add click animation feedback
      setClickedItem(targetId)
      setTimeout(() => setClickedItem(null), 300)

      // Smooth scroll with custom easing
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // Add custom smooth scroll with optimized animation
      const startPosition = window.pageYOffset
      const targetPosition = element.offsetTop - 80 // Account for navbar height
      const distance = targetPosition - startPosition
      const duration = 80 // smooth practical scrolling
      let start: number | null = null

      function animation(currentTime: number) {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function for smooth animation (ease-in-out-cubic)
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * easeInOutCubic)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }

  const navLinks = [
    { name: "About", href: "#about", icon: User },
    { name: "Skills", href: "#skills", icon: Code },
    { name: "Projects", href: "#projects", icon: FolderOpen },
    { name: "Experience", href: "#experience", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: Mail },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 flex justify-center",
        showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full",
        scrolled ? "pt-4" : "pt-6"
      )}
    >
      {/* Desktop Navigation */}
      <nav className={cn(
        "hidden md:flex items-center px-6 py-3 rounded-full transition-all duration-500",
        "bg-black/20 backdrop-blur-xl border border-white/10",
        "shadow-lg shadow-black/20",
        scrolled
          ? "bg-black/30 border-white/20"
          : "bg-black/10 border-white/5"
      )}>
        <div className="flex items-center space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => smoothScrollTo(link.href.substring(1))}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group",
                activeSection === link.href.substring(1)
                  ? "text-white bg-white/10 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5",
                clickedItem === link.href.substring(1) && "scale-95 bg-primary/20"
              )}
            >
              {activeSection === link.href.substring(1) && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-lg"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              {link.name}
            </button>
          ))}

          <div className="w-px h-6 bg-white/20 mx-2" />

          <Button
            size="sm"
            className="bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white group transition-all duration-300 border-none rounded-full px-4 py-2 shadow-lg"
            onClick={() => window.open("https://drive.google.com/file/d/1Hojq4Hx1jY4n0GnkjFnmm8lQWNXj2Coy/view", "_blank")}
          >
            <FileText size={14} className="mr-1" />
            Resume
            <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        </div>
      </nav>

      {/* Mobile Hamburger Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 text-white bg-black/30 backdrop-blur-xl p-3 rounded-full border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-lg"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-20 right-4 z-40 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col space-y-4 min-w-[200px]">
              {navLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <button
                    key={link.name}
                    onClick={() => smoothScrollTo(link.href.substring(1))}
                    className={cn(
                      "flex items-center space-x-3 py-3 px-4 rounded-full text-left hover:bg-white/10 transition-all duration-300 w-full",
                      activeSection === link.href.substring(1)
                        ? "text-white bg-white/10 shadow-lg"
                        : "text-white/80 hover:text-white",
                      clickedItem === link.href.substring(1) && "scale-95 bg-primary/20"
                    )}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{link.name}</span>
                  </button>
                )
              })}

              {/* Separator */}
              <div className="w-full h-px bg-white/20 my-2" />

              <Button
                className="w-full bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white group transition-all duration-300 border-none rounded-full shadow-lg"
                size="sm"
                onClick={() => {
                  window.open("https://drive.google.com/file/d/1Hojq4Hx1jY4n0GnkjFnmm8lQWNXj2Coy/view", "_blank")
                  setIsOpen(false)
                }}
              >
                <FileText size={14} className="mr-2" />
                Resume
                <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
