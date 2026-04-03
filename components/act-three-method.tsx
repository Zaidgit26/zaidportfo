"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

/* ── Skill Data ── */
const skillGroups = [
  {
    domain: "Machine Learning",
    skills: [
      "Python",
      "PyTorch",
      "YOLOv8",
      "OpenCV",
      "CUDA",
      "Model Training",
      "Inference Pipelines",
    ],
  },
  {
    domain: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Material UI",
    ],
  },
  {
    domain: "Backend & APIs",
    skills: [
      "Flask",
      "FastAPI",
      "REST APIs",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
  },
  {
    domain: "Mobile",
    skills: ["React Native", "Expo"],
  },
  {
    domain: "Practice",
    skills: [
      "AI-augmented development",
      "Solo architecture design",
      "GPU optimization",
      "Production deployment",
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

/* ── ACT III — THE METHOD ── */
export function ActThreeMethod() {
  const { ref: headerRef, isInView: headerInView } = useReveal(0.3);
  const { ref: stmtRef, isInView: stmtInView } = useReveal(0.15);
  const { ref: statsRef, isInView: statsInView } = useReveal(0.3);
  const { ref: skillsRef, isInView: skillsInView } = useReveal(0.15);

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
              { value: "9 months", label: "Duration" },
              { value: "1 engineer", label: "Team size" },
              { value: "full stack", label: "Scope" },
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
                    color: "var(--color-accent)",
                    lineHeight: "var(--leading-tight)",
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

        {/* ── Right: Capability Map ── */}
        <div ref={skillsRef} className="flex flex-col gap-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.domain}
              variants={fadeUp}
              initial="hidden"
              animate={skillsInView ? "visible" : "hidden"}
              custom={gi}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {group.domain}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: "var(--leading-loose)",
                }}
              >
                {group.skills.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
