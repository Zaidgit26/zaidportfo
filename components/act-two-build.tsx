"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ── Tilt Card Wrapper ── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <div
      ref={cardRef}
      className="tilt-card-inner"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
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

/* ── Single service card ── */
function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const { ref, isInView } = useReveal(0.1);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
    >
      <TiltCard>
        <div className="service-card h-full flex flex-col">
          {/* Number */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-label)",
              color: "var(--color-accent)",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            {service.number}
          </span>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 500,
              fontSize: 18,
              color: "var(--color-text-primary)",
              lineHeight: "var(--leading-tight)",
              marginBottom: 12,
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
              marginBottom: 20,
              flex: 1,
            }}
          >
            {service.description}
          </p>

          {/* Capabilities */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-text-muted)",
              lineHeight: "var(--leading-loose)",
            }}
          >
            {service.capabilities.join(" · ")}
          </p>
        </div>
      </TiltCard>
    </motion.div>
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
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
