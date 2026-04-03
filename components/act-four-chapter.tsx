"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp, lineReveal, slideLeft } from "@/lib/animation-variants";

/* ── Milestone Data ── */
const milestones = [
  {
    date: "Jan 2024",
    title: "Joined as Sole Engineer",
    description:
      "Onboarded to an early-stage product. First task: understand everything.",
  },
  {
    date: "Mar 2024",
    title: "GPU Vision System — Live",
    description:
      "Shipped real-time camera inference pipeline to production.",
  },
  {
    date: "Jun 2024",
    title: "YOLO Detection Model — Deployed",
    description:
      "Material and damage detection model trained, validated, and serving in production.",
  },
  {
    date: "Oct 2024",
    title: "Full Platform — Operational",
    description:
      "End-to-end product platform live: API, frontend, mobile interface.",
  },
];

/* ── Narrative Lines ── */
const narrativeLines = [
  "Joined Enarxi Innovations as the company\u2019s sole engineer.",
  "No handover. No documentation. A blank slate.",
  "",
  "Built the ML infrastructure. Trained the models.",
  "Wrote the APIs. Shipped the frontend.",
  "Deployed to production.",
  "",
  "Nine months. One person. The whole stack.",
];

/* ── ACT IV — THE CHAPTER ── */
export function ActFourChapter() {
  const { ref: headerRef, isInView: headerInView } = useReveal(0.3);
  const { ref: narrativeRef, isInView: narrativeInView } = useReveal(0.15);
  const { ref: timelineRef, isInView: timelineInView } = useReveal(0.1);

  return (
    <section
      id="chapter"
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
          004 / Chapter
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
          The Enarxi Arc
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

      {/* Narrative Block */}
      <div
        ref={narrativeRef}
        className="mb-20 md:mb-28"
        style={{ maxWidth: 700 }}
      >
        {narrativeLines.map((line, i) => {
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
                color: "var(--color-text-secondary)",
                overflow: "hidden",
              }}
              variants={lineReveal}
              initial="hidden"
              animate={narrativeInView ? "visible" : "hidden"}
              custom={i}
            >
              {line}
            </motion.p>
          );
        })}
      </div>

      {/* Milestone Timeline */}
      <div ref={timelineRef} className="relative" style={{ paddingLeft: "var(--space-8)" }}>
        {/* Vertical line */}
        <div
          className="absolute left-4 top-0 bottom-0"
          style={{
            width: 1,
            backgroundColor: "var(--color-border)",
          }}
        />

        <div className="flex flex-col gap-12">
          {milestones.map((milestone, i) => (
            <motion.div
              key={milestone.date}
              className="relative"
              variants={slideLeft}
              initial="hidden"
              animate={timelineInView ? "visible" : "hidden"}
              custom={i}
            >
              {/* Horizontal tick connecting to vertical line */}
              <div
                className="absolute"
                style={{
                  left: `calc(-1 * var(--space-8) + 1rem)`,
                  top: 8,
                  width: "calc(var(--space-8) - 1rem)",
                  height: 1,
                  backgroundColor: "var(--color-border)",
                }}
              />

              {/* Content */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--color-accent)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {milestone.date}
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 500,
                    fontSize: 15,
                    color: "var(--color-text-primary)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {milestone.title}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "var(--color-text-secondary)",
                    marginTop: 4,
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
