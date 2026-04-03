"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ChevronRight, User, Code, FolderOpen, Briefcase, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useMobileNavigationPerformance } from "@/hooks/use-mobile-navigation-performance"
import { useEnhancedNavigation } from "@/hooks/use-enhanced-navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Enhanced navigation hook
  const { activeSection, navigateToSection, isScrolling } = useEnhancedNavigation({
    offset: -80,
    duration: 1.2,
    threshold: 0.5
  })

  // Performance optimization hook
  const { optimizedSettings, getAnimationDuration, shouldUseReducedMotion } = useMobileNavigationPerformance()

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Optimized scroll handler for navbar visibility
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

    // Use passive listeners for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener('resize', checkMobile)
      // Cleanup: remove blur class when component unmounts
      document.body.classList.remove('mobile-nav-open')
    }
  }, [])

  const toggleMenu = () => {
    if (isAnimating) return // Prevent rapid toggling during animation

    setIsAnimating(true)
    setIsOpen(!isOpen)

    // Add/remove blur class to body when mobile menu opens/closes
    if (!isOpen) {
      document.body.classList.add('mobile-nav-open')
      // Add hardware acceleration hint
      document.body.style.transform = 'translateZ(0)'
    } else {
      document.body.classList.remove('mobile-nav-open')
      document.body.style.transform = ''
    }

    // Reset animation flag after animation completes
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleSmoothScrollTo = (targetId: string) => {
    // Close mobile menu if open with optimized animation
    if (isOpen) {
      setIsOpen(false)
      setIsAnimating(true)
      // Remove blur when navigation item is clicked
      document.body.classList.remove('mobile-nav-open')
      document.body.style.transform = ''
      setTimeout(() => setIsAnimating(false), 300)
    }

    // Add click animation feedback with hardware acceleration
    setClickedItem(targetId)
    setTimeout(() => setClickedItem(null), 300)

    // Use enhanced navigation for buttery smooth scrolling
    navigateToSection(targetId, {
      duration: isMobile ? 1.0 : 1.2 // Slightly faster on mobile for better UX
    })
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
              onClick={() => handleSmoothScrollTo(link.href.substring(1))}
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
                  transition={{
                    type: optimizedSettings.enableSpringAnimations ? "spring" : "tween",
                    duration: getAnimationDuration(600) / 1000
                  }}
                />
              )}
              {link.name}
            </button>
          ))}

          <div className="w-px h-6 bg-white/20 mx-2" />

          <Button
            size="sm"
            className="bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white group transition-all duration-300 border-none rounded-full px-4 py-2 shadow-lg"
            onClick={() => window.open("https://drive.google.com/file/d/1cB98YnieMnp488ptjxFEjATda_TXgj8t/view?usp=sharing", "_blank")}
          >
            <FileText size={14} className="mr-1" />
            Resume
            <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        </div>
      </nav>

      {/* Mobile Hamburger Menu Button - Optimized for 60FPS */}
      <motion.button
        className="md:hidden fixed top-4 right-4 z-[10000] text-white bg-black/30 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-lg"
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'transform, opacity', // Optimize for animations
        }}
        onClick={toggleMenu}
        disabled={isAnimating}
        aria-label="Toggle menu"
        whileTap={{ scale: 0.95 }}
        whileHover={{
          borderColor: 'rgba(59, 130, 246, 0.3)',
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        animate={{
          rotate: isOpen ? 180 : 0,
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </motion.button>

      {/* Mobile Navigation Menu - Optimized for 60FPS */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
              style={{
                transform: 'translateZ(0)', // Hardware acceleration
                willChange: 'opacity'
              }}
              onClick={() => {
                setIsOpen(false)
                setIsAnimating(true)
                document.body.classList.remove('mobile-nav-open')
                document.body.style.transform = ''
                setTimeout(() => setIsAnimating(false), 300)
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: -30,
                rotateX: -15
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: -30,
                rotateX: -15
              }}
              transition={optimizedSettings.enableSpringAnimations ? {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
              } : {
                type: "tween",
                duration: getAnimationDuration(300) / 1000,
                ease: "easeOut"
              }}
              className={cn(
                "md:hidden fixed top-20 right-4 z-[9999] bg-black/80 border border-white/20 rounded-2xl overflow-hidden",
                optimizedSettings.shadowIntensity
              )}
              style={{
                backdropFilter: optimizedSettings.backdropBlur,
                transform: 'translateZ(0)',
                willChange: 'transform, opacity',
                transformOrigin: 'top right'
              }}
            >
              <div className="p-6 flex flex-col space-y-2 min-w-[220px]">
                {navLinks.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={optimizedSettings.enableStaggeredAnimations ? {
                        delay: index * (optimizedSettings.staggerDelay / 1000),
                        type: optimizedSettings.enableSpringAnimations ? "spring" : "tween",
                        stiffness: 300,
                        damping: 30,
                        duration: getAnimationDuration(200) / 1000
                      } : {
                        duration: getAnimationDuration(200) / 1000,
                        ease: "easeOut"
                      }}
                    >
                      <motion.button
                        onClick={() => handleSmoothScrollTo(link.href.substring(1))}
                        className={cn(
                          "flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full relative overflow-hidden",
                          activeSection === link.href.substring(1)
                            ? "text-white bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30"
                            : "text-white/80 hover:text-white",
                          clickedItem === link.href.substring(1) && "scale-95"
                        )}
                        style={{
                          transform: 'translateZ(0)', // Hardware acceleration
                          willChange: 'transform'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        }}
                      >
                        <motion.div
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent size={20} />
                        </motion.div>
                        <span className="font-medium">{link.name}</span>

                        {/* Active indicator */}
                        {activeSection === link.href.substring(1) && (
                          <motion.div
                            className="absolute right-3 w-2 h-2 bg-primary rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  )
                })}

                {/* Separator */}
                <motion.div
                  className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: navLinks.length * 0.1 + 0.2, duration: 0.3 }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 + 0.3 }}
                >
                  <motion.button
                    className="w-full bg-gradient-to-r from-primary/80 to-blue-500/80 text-white rounded-xl py-3 px-4 font-medium shadow-lg relative overflow-hidden"
                    style={{
                      transform: 'translateZ(0)', // Hardware acceleration
                      willChange: 'transform'
                    }}
                    onClick={() => {
                      window.open("https://drive.google.com/file/d/1cB98YnieMnp488ptjxFEjATda_TXgj8t/view?usp=sharing", "_blank")
                      setIsOpen(false)
                      setIsAnimating(true)
                      document.body.classList.remove('mobile-nav-open')
                      document.body.style.transform = ''
                      setTimeout(() => setIsAnimating(false), 300)
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundImage: 'linear-gradient(to right, rgb(59 130 246), rgb(37 99 235))',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FileText size={16} />
                      </motion.div>
                      <span>Resume</span>
                      <motion.div
                        initial={{ x: -8, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
