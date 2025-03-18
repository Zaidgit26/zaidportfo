"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      const aboutSection = document.getElementById('about')
      
      if (aboutSection) {
        setShowNav(window.scrollY >= aboutSection.offsetTop - 100)
      }
      
      setScrolled(window.scrollY > 10)
      
      // Update active section based on scroll position
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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full",
        scrolled 
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 py-3" 
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          href="#home" 
          className="text-2xl font-bold group"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:from-primary group-hover:to-blue-400 transition-all duration-300">Zaid</span>
          <span className="text-primary group-hover:text-blue-400 transition-colors duration-300">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 relative group hover:bg-primary/10",
                activeSection === link.href.substring(1) 
                  ? "text-primary" 
                  : "text-white/70 hover:text-white"
              )}
            >
              {activeSection === link.href.substring(1) && (
                <motion.span 
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              {link.name}
            </Link>
          ))}
          <Button
            size="sm"
            className="ml-4 bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white neo-glow group transition-all duration-300 border-none rounded-lg"
          >
            <FileText size={14} className="mr-1" />
            Resume
            <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-foreground bg-black/30 p-2 rounded-md border border-white/10 hover:border-primary/30 transition-colors duration-300" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/80 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "py-3 px-4 rounded-md hover:bg-primary/10 transition-colors",
                    activeSection === link.href.substring(1) 
                      ? "text-primary bg-primary/10" 
                      : "text-white/80"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                className="mt-2 w-full bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white neo-glow group transition-all duration-300 border-none"
                size="sm"
              >
                <FileText size={14} className="mr-1" />
                Resume
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

