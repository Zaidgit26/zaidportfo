"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { fadeUp } from "@/lib/animation-variants";

/* ── Contact Links ── */
const contactLinks = [
  { label: "Email", href: "mailto:zaidgithub001@gmail.com" },
  { label: "GitHub", href: "https://github.com/Zaidgit26" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zaid-ahmed-b36476228/" },
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

        {/* Display text */}
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
          Let&apos;s build
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 600 }}>
            something.
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
          Open to engineering roles, freelance projects,
          <br className="hidden md:block" />
          and conversations about hard problems.
        </motion.p>

        {/* Contact links */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 md:gap-10 mt-12"
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
                e.currentTarget.style.borderBottomColor = "var(--color-accent)";
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
          © 2025 Zaid Khaleel
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          Built with Next.js
        </span>
      </div>
    </section>
  );
}
