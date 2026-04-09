"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp } from "@/lib/animation-variants";
import { personal } from "@/data/personal";

/* ── Contact Links ── */
const contactLinks = [
  { label: personal.email, href: `mailto:${personal.email}` },
  { label: "GitHub", href: personal.github },
  { label: "LinkedIn", href: personal.linkedin },
];

/* ── ACT V — THE LINE ── */
export function ActFiveLine() {
  const { ref, isInView } = useReveal(0.2);

  return (
    <section
      id="line"
      className="relative flex flex-col items-center md:items-start justify-center"
      style={{
        minHeight: "100dvh",
        paddingLeft: "var(--content-padding)",
        paddingRight: "var(--content-padding)",
      }}
    >
      <div ref={ref} className="text-center md:text-left">
        {/* Chapter label */}
        <motion.div
          className="chapter-label mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          005 / Line
        </motion.div>

        {/* Display text — animated border container */}
        <div className="animated-border inline-block" style={{ padding: 2 }}>
          <div
            className="glass-panel"
            style={{
              borderRadius: 14,
              padding: "var(--space-8)",
            }}
          >
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={1}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display)",
                fontWeight: 300,
                lineHeight: "var(--leading-tight)",
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary)",
              }}
            >
              Got a project
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 600 }}>
                in mind?
              </span>
            </motion.h2>

            {/* Body text */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={2}
              className="mt-8"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 300,
                fontSize: "var(--text-body)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-loose)",
                maxWidth: 520,
              }}
            >
              I&apos;m currently available for freelance projects.
              <br className="hidden md:block" />
              Let&apos;s talk about what you&apos;re building.
            </motion.p>

            {/* Response time */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={2.5}
              className="mt-4"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--color-accent)",
                letterSpacing: "0.05em",
              }}
            >
              ⟶ {personal.responseTime}
            </motion.p>

            {/* Contact links */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 md:gap-10 mt-10"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={3}
            >
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="inline-block transition-colors duration-150"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 300,
                    fontSize: 15,
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    borderBottom: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.borderBottomColor =
                      "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>

            {/* Resume link */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={3.5}
              className="mt-8"
            >
              <a
                href={personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-all duration-300 glass-button"
                style={{
                  padding: "14px 28px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: "var(--color-text-primary)",
                  textDecoration: "none",
                }}
              >
                Download Resume ↗
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row items-center justify-between"
        style={{
          paddingLeft: "var(--content-padding)",
          paddingRight: "var(--content-padding)",
          paddingBottom: "var(--space-4)",
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          © 2025 {personal.name}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          Available for freelance · {personal.location}
        </span>
      </div>
    </section>
  );
}
