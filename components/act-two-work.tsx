"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal } from "@/lib/animation-variants";

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
        002 / Work
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
        Things Built
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

/* ── Single project row ── */
function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const { ref, isInView } = useReveal(0.1);

  return (
    <motion.div
      ref={ref}
      className="group border-l-0 hover:border-l-2 transition-all duration-200"
      style={{
        borderColor: "transparent",
        padding: "var(--space-6) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderLeftColor = "var(--color-accent)";
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        e.currentTarget.style.paddingLeft = "var(--space-4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderLeftColor = "transparent";
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.paddingLeft = "0";
      }}
    >
      {/* Desktop: horizontal row layout */}
      <div className="hidden md:grid md:grid-cols-[10%_50%_25%_15%] items-start gap-4">
        {/* Frame number */}
        <span
          className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-title)",
            color: "var(--color-text-muted)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {project.frame}
        </span>

        {/* Title + Tagline */}
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "var(--text-heading)",
              color: "var(--color-text-primary)",
              lineHeight: "var(--leading-tight)",
            }}
          >
            {project.title}
          </h3>
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: "var(--text-small)",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="inline-block"
              style={{
                padding: "4px 10px",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.05em",
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Role / Year */}
        <div className="text-right">
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-text-muted)",
            }}
          >
            {project.role}
          </p>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-text-muted)",
              marginTop: 4,
            }}
          >
            {project.year}
          </p>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden">
        {/* Frame number above title */}
        <span
          className="block mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-200"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-heading)",
            color: "var(--color-text-muted)",
          }}
        >
          {project.frame}
        </span>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "var(--text-heading)",
            color: "var(--color-text-primary)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {project.title}
        </h3>
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 300,
            fontSize: "var(--text-small)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {project.tagline}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="inline-block"
              style={{
                padding: "4px 10px",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.05em",
                color: "var(--color-text-muted)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Role + Year */}
        <div className="flex gap-4 mt-4">
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-text-muted)",
            }}
          >
            {project.role}
          </span>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-text-muted)",
            }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ACT II — THE WORK ── */
export function ActTwoWork() {
  return (
    <section
      id="work"
      className="content-container"
      style={{
        paddingTop: "var(--space-24)",
        paddingBottom: "var(--space-24)",
      }}
    >
      <SectionHeader />
      <div>
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
