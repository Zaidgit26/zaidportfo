"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { SplineScene } from "@/components/spline-scene";
import { processSteps } from "@/data/process";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ── ACT IV — PROCESS ── */
export function ActFourProcess() {
  const { ref: headerRef, isInView: headerInView } = useReveal(0.3);
  const { ref: splineRef, isInView: splineInView } = useReveal(0.1);
  const { ref: cardsRef, isInView: cardsInView } = useReveal(0.1);
  const isDesktop = useIsDesktop();

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

      {/* Spline scene — desktop only */}
      {isDesktop && (
        <motion.div
          ref={splineRef}
          className="pointer-events-none mb-16"
          style={{ width: "100%", height: 300 }}
          variants={fadeUp}
          initial="hidden"
          animate={splineInView ? "visible" : "hidden"}
        >
          <SplineScene
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            className="w-full h-full"
          />
        </motion.div>
      )}

      {/* Process cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {processSteps.map((step, i) => (
          <motion.div
            key={step.step}
            className="service-card flex flex-col"
            variants={fadeUp}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            custom={i}
          >
            {/* Step number */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-title)",
                color: "var(--color-accent)",
                lineHeight: "var(--leading-tight)",
                marginBottom: 12,
              }}
            >
              {step.step}
            </span>

            {/* Title */}
            <h4
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 500,
                fontSize: 16,
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
