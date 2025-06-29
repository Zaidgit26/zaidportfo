"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { FileText, ChevronRight, User, Code, FolderOpen, Briefcase, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useActiveSection } from "@/hooks/use-active-section"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)

  const activeSection = useActiveSection()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowNav(true)
          setScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }

    setShowNav(true)
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.classList.remove('mobile-nav-open')
    }
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev
      if (newState) {
        document.body.classList.add('mobile-nav-open')
      } else {
        document.body.classList.remove('mobile-nav-open')
      }
      return newState
    })
  }, [])

  const smoothScrollTo = useCallback((targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      setIsOpen(false)
      document.body.classList.remove('mobile-nav-open')

      setClickedItem(targetId)
      setTimeout(() => setClickedItem(null), 200)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  const navLinks = useMemo(() => [
    { name: "About", href: "#about", icon: User },
    { name: "Skills", href: "#skills", icon: Code },
    { name: "Projects", href: "#projects", icon: FolderOpen },
    { name: "Experience", href: "#experience", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: Mail },
  ], [])

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
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1)
            const isClicked = clickedItem === link.href.substring(1)

            return (
              <button
                key={link.name}
                onClick={() => smoothScrollTo(link.href.substring(1))}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative group",
                  isActive
                    ? "text-white bg-white/10 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                  isClicked && "scale-95 bg-primary/20"
                )}
                style={{ willChange: 'transform' }}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-lg"
                    transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                  />
                )}
                {link.name}
              </button>
            )
          })}

          <div className="w-px h-6 bg-white/20 mx-2" />

          <Button
            size="sm"
            className="bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white group transition-all duration-300 border-none rounded-full px-4 py-2 shadow-lg"
            onClick={() => window.open("https://drive.google.com/file/d/1hxZtbXkdk1GbSVsn7Gr3yj6uxJaL194l/view?usp=drive_link", "_blank")}
          >
            <FileText size={14} className="mr-1" />
            Resume
            <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        </div>
      </nav>

      {/* Mobile Hamburger Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-[10000] text-white bg-black/30 backdrop-blur-xl p-3 rounded-full border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-lg"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{
              duration: 1, // ← smooth 1 second slide animation
              ease: [0.4, 0.0, 0.2, 1],
              type: "tween"
            }}
            className="md:hidden fixed top-20 right-4 z-[9999] bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            style={{ willChange: 'transform, opacity' }}
            data-mobile-nav
          >
            <div className="p-6 flex flex-col space-y-4 min-w-[200px]">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon
                const isActive = activeSection === link.href.substring(1)
                const isClicked = clickedItem === link.href.substring(1)

                return (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: index * 0.02,
                      ease: "easeOut"
                    }}
                    onClick={() => smoothScrollTo(link.href.substring(1))}
                    className={cn(
                      "flex items-center space-x-3 py-3 px-4 rounded-full text-left transition-colors duration-150 w-full",
                      isActive
                        ? "text-white bg-white/10 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/5",
                      isClicked && "scale-95 bg-primary/20"
                    )}
                    style={{ willChange: 'transform' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{link.name}</span>
                  </motion.button>
                )
              })}

              <div className="w-full h-px bg-white/20 my-2" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: 0.1 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white group transition-colors duration-150 border-none rounded-full shadow-lg"
                  size="sm"
                  onClick={() => {
                    window.open("https://drive.google.com/file/d/1hxZtbXkdk1GbSVsn7Gr3yj6uxJaL194l/view?usp=drive_link", "_blank")
                    setIsOpen(false)
                    document.body.classList.remove('mobile-nav-open')
                  }}
                >
                  <FileText size={14} className="mr-2" />
                  Resume
                  <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
