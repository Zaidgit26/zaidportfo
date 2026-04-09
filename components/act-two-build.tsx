"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ─────────────────────────────────────────────────────
   AURORA CARD — Premium interactive service card
   
   Effects:
   • 3D perspective tilt following cursor (12deg max)
   • Cursor-tracking radial gradient glow on border
   • Holographic shine sweep on hover
   • Glassmorphism depth with layered backgrounds
   • Scale lift on hover
   ───────────────────────────────────────────────────── */
function AuroraCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const centerX = x - 0.5;
    const centerY = y - 0.5;

    setTilt({
      rx: centerY * -12, // tilt X axis (up/down)
      ry: centerX * 12, // tilt Y axis (left/right)
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const { ref, isInView } = useReveal(0.1);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          cursor: "default",
        }}
      >
        {/* ── Multi-layer glassmorphic card background ── */}
        <div
          className="glass-panel"
          style={{
            position: "relative",
            border: isHovered
              ? "1px solid rgba(0, 240, 255, 0.4)" // Cyan border on hover
              : "1px solid var(--color-border)",
            borderRadius: 16,
            padding: "2rem",
            transition: "border-color 300ms ease",
            overflow: "hidden",
          }}
        >
          {/* Cursor-tracking gradient glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, rgba(157, 78, 221, ${isHovered ? 0.2 : 0}), transparent 50%)`,
              transition: "opacity 400ms ease",
              pointerEvents: "none",
              borderRadius: 16,
            }}
          />

          {/* Holographic shine sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, ${isHovered ? 0.04 : 0}) 45%, transparent 55%)`,
              backgroundPosition: isHovered ? "200% 0" : "-200% 0",
              transition: "background-position 700ms ease, opacity 300ms",
              pointerEvents: "none",
              borderRadius: 16,
            }}
          />

          {/* Inner content with Z-depth */}
          <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section header ── */
function SectionHeader() {
  const { ref, isInView } = useReveal(0.3);

  return (
    <div ref={ref} className="mb-16 md:mb-24">
      <motion.div
        className="chapter-label mb-6"
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        002 / Build
      </motion.div>
      <motion.h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-title)",
          fontWeight: 300,
          letterSpacing: "-0.03em",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-text-primary)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={1}
      >
        What I Build
      </motion.h2>
      <motion.div
        className="mt-6"
        style={{
          height: 1,
          backgroundColor: "var(--color-border-strong)",
        }}
        variants={lineReveal}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={2}
      />
    </div>
  );
}

/* ── Service card content ── */
function ServiceContent({ service }: { service: (typeof services)[0] }) {
  return (
    <div className="h-full flex flex-col" style={{ minHeight: 220 }}>
      {/* Number with glow */}
      <div className="flex items-center gap-3 mb-5">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-title)",
            color: "var(--color-accent-blue)",
            lineHeight: 1,
            textShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
          }}
        >
          {service.number}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, var(--color-border-strong), transparent)",
          }}
        />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 500,
          fontSize: 20,
          color: "var(--color-text-primary)",
          lineHeight: "var(--leading-tight)",
          marginBottom: 14,
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 300,
          fontSize: 14,
          color: "var(--color-text-secondary)",
          lineHeight: "var(--leading-normal)",
          marginBottom: 24,
          flex: 1,
        }}
      >
        {service.description}
      </p>

      {/* Capabilities with gradient dividers */}
      <div className="flex flex-wrap gap-2">
        {service.capabilities.map((tech, i) => (
          <span
            key={tech}
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
            }}
          >
            {tech}
            {i < service.capabilities.length - 1 && (
              <span
                style={{
                  color: "var(--color-accent)",
                  opacity: 0.4,
                  fontSize: 8,
                }}
              >
                ◆
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── ACT II — BUILD ── */
export function ActTwoBuild() {
  return (
    <section
      id="build"
      className="content-container"
      style={{
        paddingTop: "var(--space-24)",
        paddingBottom: "var(--space-24)",
      }}
    >
      <SectionHeader />

      {/* 3-column grid desktop, single column mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <AuroraCard key={service.id} index={index}>
            <ServiceContent service={service} />
          </AuroraCard>
        ))}
      </div>
    </section>
  );
}
