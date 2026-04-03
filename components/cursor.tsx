"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [hoverState, setHoverState] = useState<"default" | "link" | "text">("default");
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Only show on non-touch desktop devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 768) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    // Hide system cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(style);

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isLink =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']");
      const isText =
        target.closest("p") ||
        target.closest("span") ||
        target.closest("h1") ||
        target.closest("h2") ||
        target.closest("h3") ||
        target.closest("li");

      if (isLink) {
        setHoverState("link");
      } else if (isText && !isLink) {
        setHoverState("text");
      } else {
        setHoverState("default");
      }
    };

    const onMouseLeave = () => {
      setHoverState("default");
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Lerp animation loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const LERP_FACTOR = 0.12; // ~80ms lag at 60fps

    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, LERP_FACTOR);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, LERP_FACTOR);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      style.remove();
    };
  }, []);

  if (isTouch) return null;

  const getDotStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 9999,
      willChange: "transform",
      transition: "width 200ms ease, height 200ms ease, opacity 200ms ease, background 200ms ease, border-radius 200ms ease, border 200ms ease",
    };

    switch (hoverState) {
      case "link":
        return {
          ...base,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: "50%",
          background: "var(--color-text-primary)",
          opacity: 0.15,
          border: "1px solid var(--color-accent)",
        };
      case "text":
        return {
          ...base,
          width: 24,
          height: 2,
          marginLeft: -12,
          marginTop: -1,
          borderRadius: 1,
          background: "var(--color-accent)",
          opacity: 0.7,
          border: "none",
        };
      default:
        return {
          ...base,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: "var(--color-accent)",
          opacity: 0.9,
          border: "none",
        };
    }
  };

  return <div ref={dotRef} style={getDotStyle()} />;
}
