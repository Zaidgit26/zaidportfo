"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { personal } from "@/data/personal";
import { SplineScene } from "@/components/spline-scene";
import { useIsDesktop } from "@/hooks/use-is-desktop";

/* ── Noise Texture (static canvas, generated once) ── */
function useNoiseTexture() {
  const dataUrl = useRef<string>("");

  useEffect(() => {
    if (dataUrl.current) return;
    const canvas = document.createElement("canvas");
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 8;
    }
    ctx.putImageData(imageData, 0, 0);
    dataUrl.current = canvas.toDataURL("image/png");
  }, []);

  return dataUrl;
}

/* ── Character-by-character text reveal ── */
function CharReveal({
  text,
  className,
  style,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startDelay?: number;
}) {
  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: startDelay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Typewriter effect ── */
function Typewriter({
  text,
  startDelay = 0,
  duration = 1200,
  className,
  style,
}: {
  text: string;
  startDelay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setShowCursor(true);
      const interval = duration / text.length;
      let idx = 0;
      const timer = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, startDelay, duration]);

  return (
    <span className={className} style={style}>
      {displayed}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          style={{ color: "var(--color-accent)" }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

/* ── ACT I — THE SIGNAL ── */
export function ActOneSignal() {
  const noiseUrl = useNoiseTexture();
  const isDesktop = useIsDesktop();

  const handleScrollToBuild = () => {
    const el = document.getElementById("build");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToContact = () => {
    const el = document.getElementById("line");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="signal"
      className="relative w-full flex items-start justify-start overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--color-void)",
        paddingLeft: "var(--content-padding)",
        paddingRight: "var(--content-padding)",
      }}
    >
      {/* Noise texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: noiseUrl.current
            ? `url(${noiseUrl.current})`
            : undefined,
          backgroundRepeat: "repeat",
          opacity: 0.4,
        }}
      />

      {/* Spline 3D scene — desktop only, right half */}
      {isDesktop && (
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{ width: "50%", height: "100%", opacity: 0.7 }}
        >
          <SplineScene
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      )}

      {/* STEP 1 — Accent line across top */}
      <motion.div
        className="absolute top-0 left-0 h-[1px]"
        style={{ backgroundColor: "var(--color-accent)" }}
        initial={{ width: "0vw" }}
        animate={{ width: "100vw" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Main content — 40% from top offset */}
      <div
        className="relative z-10 flex flex-col justify-start w-full"
        style={{ paddingTop: "40dvh", transform: "translateY(-15%)" }}
      >
        {/* Availability badge */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid var(--color-border-strong)",
              padding: "6px 14px",
              borderRadius: 100,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4A7C59",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "var(--color-text-secondary)",
              }}
            >
              {personal.availability}
            </span>
          </div>
        </motion.div>

        {/* STEP 2 — Chapter label */}
        <motion.div
          className="chapter-label mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          001 / Signal
        </motion.div>

        {/* STEP 3 — Name reveal */}
        <h1 className="overflow-hidden">
          <CharReveal
            text={personal.nameDisplay.first}
            startDelay={0.7}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display)",
              fontWeight: 300,
              lineHeight: "var(--leading-tight)",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          />
          <br />
          <CharReveal
            text={personal.nameDisplay.last}
            startDelay={0.9}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          />
        </h1>

        {/* STEP 4 — Role typewriter */}
        <div className="mt-6">
          <Typewriter
            text={personal.role}
            startDelay={1400}
            duration={1200}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-small)",
              color: "var(--color-text-secondary)",
              letterSpacing: "0.05em",
            }}
          />
        </div>

        {/* STEP 5 — Sub-description */}
        <div className="mt-8 flex flex-col gap-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: "var(--text-body)",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-loose)",
              maxWidth: 540,
            }}
          >
            {personal.tagline}
          </motion.p>
        </div>

        {/* STEP 6 — CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.4 }}
        >
          <button
            onClick={handleScrollToBuild}
            className="group transition-all duration-200"
            style={{
              padding: "14px 28px",
              border: "1px solid var(--color-border-strong)",
              background: "transparent",
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            See What I Build ↓
          </button>
          <button
            onClick={handleScrollToContact}
            className="group transition-all duration-200"
            style={{
              padding: "14px 28px",
              border: "1px solid var(--color-border-strong)",
              background: "transparent",
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            Work With Me →
          </button>
        </motion.div>
      </div>

      {/* STEP 7 — Scroll indicator (desktop only) */}
      <div className="absolute bottom-8 right-[var(--content-padding)] hidden md:flex flex-col items-center gap-3">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.6 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "var(--color-text-muted)",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          SCROLL
        </motion.span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          <motion.div
            style={{
              width: 1,
              height: 40,
              backgroundColor: "var(--color-text-muted)",
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
