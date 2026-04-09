"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ── Skill Data ── */
const skillGroups = [
  {
    domain: "Frontend",
    icon: "◇",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Material UI",
      "Figma",
    ],
  },
  {
    domain: "Backend & APIs",
    icon: "⬡",
    skills: [
      "Node.js",
      "Python",
      "Flask",
      "FastAPI",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
  },
  {
    domain: "ML & AI",
    icon: "△",
    skills: [
      "PyTorch",
      "YOLOv8",
      "OpenCV",
      "CUDA",
      "Python ML",
      "Model Training",
      "Inference Pipelines",
    ],
  },
  {
    domain: "Mobile",
    icon: "○",
    skills: ["React Native", "Expo", "TypeScript"],
  },
  {
    domain: "DevOps & Tools",
    icon: "⊞",
    skills: ["Git", "Docker", "CI/CD", "Linux", "Vercel", "Railway"],
  },
  {
    domain: "AI-Augmented Dev",
    icon: "✦",
    skills: [
      "Cursor",
      "GitHub Copilot",
      "Prompt Engineering",
      "Rapid prototyping",
    ],
  },
];

/* ── Statement Lines ── */
const statementLines = [
  "Building alone teaches you",
  "everything fast.",
  "",
  "You learn the stack end to end.",
  "You make every decision.",
  "You own every mistake.",
  "",
  "That\u2019s the education.",
];

/* ── Living Spotlight Card with cursor-tracking glow + gradient border ── */
function LivingCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGlowPos({ x: x * 100, y: y * 100 });
    setTilt({
      rx: (y - 0.5) * -6,
      ry: (x - 0.5) * 6,
    });
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setTilt({ rx: 0, ry: 0 });
        }}
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-panel"
        style={{
          position: "relative",
          overflow: "hidden",
          border: isHovered
            ? "1px solid rgba(0, 240, 255, 0.3)" // Cyan glow on hover
            : "1px solid var(--color-border)",
          borderRadius: 14,
          padding: "1.5rem",
          perspective: 800,
          transformStyle: "preserve-3d",
          transition: "border-color 300ms ease",
        }}
      >
        {/* Cursor-tracking warm glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(157, 78, 221, ${isHovered ? 0.15 : 0}), transparent 60%)`,
            transition: "opacity 300ms ease",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── ACT III — THE METHOD ── */
export function ActThreeMethod() {
  const { ref: headerRef, isInView: headerInView } = useReveal(0.3);
  const { ref: stmtRef, isInView: stmtInView } = useReveal(0.15);
  const { ref: statsRef, isInView: statsInView } = useReveal(0.3);

  return (
    <section
      id="method"
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
          003 / Method
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
          How It Gets Built
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* ── Left: The Statement ── */}
        <div>
          <div ref={stmtRef}>
            {statementLines.map((line, i) => {
              if (line === "") {
                return <div key={i} style={{ height: "var(--space-4)" }} />;
              }
              return (
                <motion.p
                  key={i}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-heading)",
                    fontWeight: 300,
                    lineHeight: "var(--leading-loose)",
                    color: "var(--color-text-primary)",
                    overflow: "hidden",
                  }}
                  variants={lineReveal}
                  initial="hidden"
                  animate={stmtInView ? "visible" : "hidden"}
                  custom={i}
                >
                  {line}
                </motion.p>
              );
            })}
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-wrap gap-8 md:gap-12"
            style={{ marginTop: "var(--space-12)" }}
          >
            {[
              { value: "5 services", label: "Offerings" },
              { value: "full stack", label: "Scope" },
              { value: "AI-augmented", label: "Builds" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                animate={statsInView ? "visible" : "hidden"}
                custom={i}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-title)",
                    color: "var(--color-accent-blue)",
                    lineHeight: "var(--leading-tight)",
                    textShadow: "0 0 30px rgba(0, 240, 255, 0.4)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "var(--text-small)",
                    color: "var(--color-text-muted)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Capability Map with Living Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillGroups.map((group, gi) => (
            <LivingCard key={group.domain} index={gi}>
              {/* Icon + Domain header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--color-accent)",
                    opacity: 0.7,
                  }}
                >
                  {group.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                  }}
                >
                  {group.domain}
                </span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontWeight: 300,
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </LivingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
