"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { processSteps } from "@/data/process";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ── Process Step Card with number glow + cursor tracking ── */
function ProcessCard({
  step,
  index,
}: {
  step: (typeof processSteps)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const { ref, isInView } = useReveal(0.1);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGlowPos({ x: x * 100, y: y * 100 });
    setTilt({ rx: (y - 0.5) * -8, ry: (x - 0.5) * 8 });
  }, []);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setTilt({ rx: 0, ry: 0 });
        }}
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-panel"
        style={{
          position: "relative",
          overflow: "hidden",
          border: isHovered
            ? "1px solid rgba(0, 240, 255, 0.3)" // Cyan glow on hover
            : "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "2rem",
          perspective: 1000,
          transformStyle: "preserve-3d",
          transition: "border-color 300ms ease",
        }}
      >
        {/* Cursor-tracking gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(157, 78, 221, ${isHovered ? 0.15 : 0}), transparent 50%)`,
            pointerEvents: "none",
            transition: "opacity 300ms",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Step number — large, glowing */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-display)",
              color: "var(--color-accent-blue)",
              lineHeight: 1,
              marginBottom: 16,
              opacity: isHovered ? 1 : 0.6,
              textShadow: isHovered
                ? "0 0 40px rgba(0, 240, 255, 0.5)"
                : "none",
              transition: "opacity 300ms, text-shadow 300ms",
            }}
          >
            {step.step}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: isHovered ? "100%" : "30%",
              height: 1,
              background:
                "linear-gradient(90deg, var(--color-accent), transparent)",
              transition: "width 500ms ease",
              marginBottom: 16,
            }}
          />

          {/* Title */}
          <h4
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 500,
              fontSize: 18,
              color: "var(--color-text-primary)",
              marginBottom: 10,
            }}
          >
            {step.title}
          </h4>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            {step.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── ACT IV — PROCESS ── */
export function ActFourProcess() {
  const { ref: headerRef, isInView: headerInView } = useReveal(0.3);

  return (
    <section
      id="process"
      className="content-container"
      style={{
        paddingTop: "var(--space-24)",
        paddingBottom: "var(--space-24)",
      }}
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16 md:mb-24">
        <motion.div
          className="chapter-label mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          004 / Process
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
          animate={headerInView ? "visible" : "hidden"}
          custom={1}
        >
          How I Work
        </motion.h2>
        <motion.div
          className="mt-6"
          style={{ height: 1, backgroundColor: "var(--color-border-strong)" }}
          variants={lineReveal}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={2}
        />
      </div>

      {/* Process cards — 4 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, i) => (
          <ProcessCard key={step.step} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
