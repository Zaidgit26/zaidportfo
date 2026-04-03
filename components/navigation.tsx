"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";

const NAV_ITEMS = [
  { label: "Signal", href: "#signal" },
  { label: "Work", href: "#work" },
  { label: "Method", href: "#method" },
  { label: "Chapter", href: "#chapter" },
  { label: "Line", href: "#line" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("signal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sectionIds = ["signal", "work", "method", "chapter", "line"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    },
    []
  );

  return (
    <>
      {/* ── Top Bar ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14"
        style={{
          paddingLeft: "var(--content-padding)",
          paddingRight: "var(--content-padding)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            backgroundColor: scrolled ? "rgba(8,8,8,0.9)" : "rgba(8,8,8,0)",
            backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Monogram */}
        <a
          href="#signal"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#signal");
          }}
          className="font-mono text-[13px] tracking-[0.15em]"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
        >
          ZK
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="relative py-1 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  fontSize: 13,
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[2px] h-4"
                    style={{ backgroundColor: "var(--color-accent)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col items-end gap-[5px] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-[1.5px] bg-current"
            style={{ color: "var(--color-text-primary)", width: 24 }}
            animate={mobileMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-[1.5px] bg-current"
            style={{ color: "var(--color-text-primary)", width: 16 }}
            animate={mobileMenuOpen ? { rotate: -45, y: -0 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </motion.nav>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: "var(--color-void)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-10">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-title font-display"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-title)",
                    fontWeight: 300,
                    color: "var(--color-text-primary)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
